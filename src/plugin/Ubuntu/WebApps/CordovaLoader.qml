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

Item {
    id: root

    property string htmlIndexDirectory

    // Cordova plugin instance
    property var cordovaInstance: null

    signal created();
    signal creationError();

    function _tryCreateObject(statement, parent) {
        var result = null;
        try {
            result = Qt.createQmlObject(statement, parent);
        }
        catch (e) {};

        return result;
    }

    function _getCordovaObjectCreationStatementFor(version, params) {
        return 'import CordovaUbuntu '
                + version
                + '; CordovaView { '
                + ' anchors.fill: parent; '
                + params + ';'
                + '}';
    }

    function _tryCreateCordovaObject(version, params) {
        var _params = params || '';
        return _tryCreateObject(_getCordovaObjectCreationStatementFor(version, params), root);
    }

    function _ensureCordovaInitDone() {
        if (cordovaInstance && htmlIndexDirectory.length !== 0) {
            cordovaInstance.wwwDir = htmlIndexDirectory;
        }
    }

    onHtmlIndexDirectoryChanged: _ensureCordovaInitDone()

    Component.onCompleted: {
        // selectively try to load cordova
        var cordova = null;

        var candidates = [{version: '3.4', paramString: 'contentFile: "index.html"'}];
        for (var i = 0; i < candidates.length; ++i) {
            cordova = _tryCreateCordovaObject(candidates[i].version,
                                              candidates[i].paramString);
            if (cordova)
                break;
        }

        if ( ! cordova) {
            console.error('Cannot create CordovaView object.');
            creationError();
            return;
        }

        root.cordovaInstance = cordova;

        _ensureCordovaInitDone();

        created();
    }
}
