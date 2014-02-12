/*
 * Copyright 2014 Canonical Ltd.
 *
 * This file is part of ubuntu-html5-container.
 *
 * ubuntu-html5-container is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * webbrowser-app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import QtQuick 2.0
import Ubuntu.Components 0.1
import Ubuntu.Components.Extras.Browser 0.1


/*!
    \qmltype WebAppContainer
    \inqmlmodule Ubuntu.WebApps 0.1
    \ingroup ubuntu
    \brief WebAppContainer is the root element that should be used for all HTML5 applications.
*/
MainView {
    id: root
    objectName: "root"

    automaticOrientation: true

    /*!
      \preliminary
      The property holds the path to the filesystem location where the 'index.html'
      file can be found (root of the HTML5 application).

      The path is absolute or relative to the current dir.
      */
    property alias htmlIndexDirectory: cordovaWebviewProvider.htmlIndexDirectory

    Page {
        id: mainPage

        /*!
          \internal
         */
        CordovaLoader {
            id: cordovaWebviewProvider
            anchors.fill: parent
            onCreationError: {
                mainPage._onCordovaCreationError();
            }
            onCreated: {
                bindings.bindingMainWebview = Qt.binding(function() {
                    return cordovaInstance.mainWebview;
                });
            }
        }

        /*!
          \internal
         */
        function _onCordovaCreationError() {
            mainPage._fallbackToWebview();
        }

        /*!
          \internal
         */
        function _fallbackToWebview() {
            console.debug('Falling back on the plain Webview backend.')

            webviewFallbackComponentLoader.sourceComponent = Qt.binding(function() {
                return root.htmlIndexDirectory.length !== 0
                        ? webviewFallbackComponent : null;
            });
        }

        /*!
          \internal
         */
        function _getAppStartupIndexFileUri() {
            return 'file://' + root.htmlIndexDirectory + '/index.html';
        }

        /*!
          \internal
         */
        Loader {
            id: webviewFallbackComponentLoader
            anchors.fill: parent
            onLoaded: {
                bindings.bindingMainWebview = item;
            }
        }

        /*!
          \internal
         */
        Component {
            id: webviewFallbackComponent
            UbuntuWebView {
                url: mainPage._getAppStartupIndexFileUri()

                experimental.preferences.localStorageEnabled: true
                experimental.preferences.offlineWebApplicationCacheEnabled: true
                experimental.preferences.universalAccessFromFileURLsAllowed: true
                experimental.preferences.webGLEnabled: true

                experimental.databaseQuotaDialog: Item {
                    Timer {
                        interval: 1
                        running: true
                        onTriggered: {
                            model.accept(model.expectedUsage)
                        }
                    }
                }
                // port in QTWEBKIT_INSPECTOR_SERVER enviroment variable
                experimental.preferences.developerExtrasEnabled: true
            }
        }

        /*!
          \internal
         */
        UbuntuJavascriptBindings {
            id: bindings
        }
    }
}

