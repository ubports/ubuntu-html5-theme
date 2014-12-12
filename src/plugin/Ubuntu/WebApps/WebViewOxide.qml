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
import Ubuntu.Web 0.2
import com.canonical.Oxide 1.0 as Oxide

WebView {
    id: webview

    property bool remoteInspectorEnabled: false

    preferences.localStorageEnabled: true
    preferences.allowUniversalAccessFromFileUrls: true
    preferences.appCacheEnabled: true

    function isNewForegroundWebViewDisposition(disposition) {
        return disposition === Oxide.NavigationRequest.DispositionNewPopup ||
               disposition === Oxide.NavigationRequest.DispositionNewForegroundTab;
    }

    function navigationRequestedDelegate(request) {
        var url = request.url.toString()
        if (isNewForegroundWebViewDisposition(request.disposition)) {
            request.action = Oxide.NavigationRequest.ActionReject
            Qt.openUrlExternally(url)
            return
        }
        if (url.indexOf("file://") !== 0) {
            request.action = Oxide.NavigationRequest.ActionReject
            Qt.openUrlExternally(url)
            return
        }
    }
}
