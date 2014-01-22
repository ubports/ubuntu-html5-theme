/*
 * Copyright 2013 Canonical Ltd.
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
import CordovaUbuntu 2.8
import Ubuntu.UnityWebApps 0.1


/*!
    \qmltype WebAppContainer
    \inqmlmodule Ubuntu.WebApps 0.1
    \ingroup ubuntu
    \brief WebAppContainer is the root Item that should be used for all HTML5 applications.
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
    property alias htmlIndexDirectory: view.wwwDir

    /*!
      \internal
     */
    CordovaView {
        id: cordovaView
        objectName: "view"

        anchors.fill: parent
    }

    function getUnityWebappsProxies() {
        return UnityWebAppsUtils.makeProxiesForQtWebViewBindee(cordovaView.mainWebview);
    }

    UnityWebApps {
        id: webapps
        bindee: root
	injectExtraUbuntuApis: true
	requiresInit: false
    }
}

