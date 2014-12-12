/*
 * Copyright 2014 Canonical Ltd.
 *
 * This file is part of ubuntu-html5-ui-toolkit.
 *
 * ubuntu-html5-ui-toolkit is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * ubuntu-html5-ui-toolkit is distributed in the hope that it will be useful,
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

UbuntuWebView {
    id: webview

    onNewTabRequested: Qt.openUrlExternally(url)

    property bool remoteInspectorEnabled: false
    property string remoteInspectorPort: ""
    property string remoteInspectorHost: ""

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
