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
Item {
    id: root
    objectName: "root"

    /*!
      \preliminary
      The property holds the path to the filesystem location where the 'index.html'
      file can be found (root of the HTML5 application).

      The path is absolute or relative to the current dir.
      */
    property alias htmlIndexDirectory: cordovaWebviewProvider.htmlIndexDirectory

    /*!
      \internal
     */
    CordovaLoader {
        id: cordovaWebviewProvider
        anchors.fill: parent
        onCreationError: {
            _onCordovaCreationError();
        }
        onCreated: {
            bindings.webviewProvider = cordovaInstance;
        }
    }

    /*!
      \internal
     */
    function _onCordovaCreationError() {
        _fallbackToWebview();
    }

    /*!
      \internal
     */
    function _fallbackToWebview() {
        console.debug('Falling back on the plain Webview backend.')

        webviewComponentLoader.sourceComponent = Qt.binding(function() {
            return htmlIndexDirectory.length !== 0 && webviewComponent ? webviewComponent : null;
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
        onLoaded: bindings.webviewProvider = item.currentWebview;
    }

    /*!
      \internal
     */
    Component {
        id: webviewFallbackComponent
        UbuntuWebView {
            url: _getAppStartupIndexFileUri()
        }
    }

    /*!
      \internal
     */
    UbuntuJavascriptBindings {
        id: bindings
    }
}

