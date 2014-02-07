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
import Ubuntu.UnityWebApps 0.1


Item {
    id: root

    property var webviewProvider: null

    /*!
      \internal
     */
    function getUnityWebappsProxies() {
        return UnityWebAppsUtils.makeProxiesForQtWebViewBindee(webviewProvider.mainWebview);
    }

    /*!
      \internal
     */
    Loader {
        id: webappBindingsLoader
        visible: false
        anchors.fill: parent
        sourceComponent: (webviewProvider && webviewProvider.mainWebview) ? webappBindingsComponent : undefined
    }

    /*!
      \internal
     */
    Component {
        id: webappBindingsComponent

        UnityWebApps {
            id: webapps
            bindee: root
            injectExtraUbuntuApis: true
            requiresInit: false
        }
    }
}

