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
import Ubuntu.UnityWebApps 0.1
import com.canonical.Oxide 1.0 as Oxide
import Ubuntu.Web 0.2

/*!
    \qmltype WebAppContainer
    \inqmlmodule Ubuntu.WebApps 0.1
    \ingroup ubuntu
    \brief WebAppContainer is the root element that should be used for all HTML5 applications.
*/
MainView {
    id: root
    objectName: "root"

    anchorToKeyboard: true
    automaticOrientation: true

    /*!
      \preliminary
      The property holds the path to the filesystem location where the 'index.html'
      file can be found (root of the HTML5 application).

      The path is absolute or relative to the current dir.
      */
    property string htmlIndexDirectory: ""

    /*!
      \preliminary
      The properties hold whether the remote debugging interface should be enabled for the
      Web View. The host ip and port for accessing the remote interface should be provided.
      */
    property bool remoteInspectorEnabled: false

    Page {
        id: mainPage
        anchors.fill: parent

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
            id: webviewComponentLoader
            anchors.fill: parent
            onLoaded: {
                webappBindingsLoader.sourceComponent = webappBindingsComponent
            }
        }

        Component {
            id: webviewComponent

            WebView {
                id: webview

                preferences.allowUniversalAccessFromFileUrls: true
                preferences.allowFileAccessFromFileUrls: true
                preferences.appCacheEnabled: true
                preferences.localStorageEnabled: true

                function navigationRequestedDelegate(request) {
                    var url = request.url.toString()

                    if (url.indexOf("file://") !== 0) {
                        request.action = Oxide.NavigationRequest.ActionReject
                        Qt.openUrlExternally(url)
                        return
                    }
                }
            }
        }

        Component.onCompleted: {
            webviewComponentLoader.sourceComponent = webviewComponent;
        }

        /*!
          \internal
         */
        function getUnityWebappsProxies() {
            return UnityWebAppsUtils.makeProxiesForWebViewBindee(webviewComponentLoader.item);
        }

        /*!
          \internal
         */
        Loader {
            id: webappBindingsLoader
            visible: false
            anchors.fill: parent
        }

        function userScriptInjected() {
            webviewComponentLoader.item.url =
                mainPage._getAppStartupIndexFileUri();
        }

        /*!
          \internal
         */
        Component {
            id: webappBindingsComponent

            UnityWebApps {
                bindee: mainPage
                injectExtraUbuntuApis: true
                requiresInit: false

                onUserScriptsInjected: mainPage.userScriptInjected()
            }
        }
    }
}
