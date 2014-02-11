/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of ubuntu-html5-ui-toolkit.
 *
 * ubuntu-html5-ui-toolkit is free software; you can redistribute it and/or modify
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
import QtWebKit 3.0
import QtWebKit.experimental 1.0

Rectangle {
    id: root
    objectName: "webviewContainer"

    width: 640
    height: 640

    property string url

    signal resultUpdated(string message)

    function __gentid() {
        return Math.random() + '';
    }

    function __wrapJsCommands(commands) {
        return '(function() { ' + commands + ' })();'
    }

    function __createResult(result, tid) {
        return JSON.stringify({result: result, tid: tid});
    }

    function __dumpValue(v) {
    	if (typeof(v) === "string") {
            return "'" + v + "'";
        }
        return v;
    }

    function __setupClosedVariables(variables) {
        var variableDeclStatements = '';
        for (var variable in variables) {
            if (variables.hasOwnProperty(variable)) {
                variableDeclStatements += 'var ' + variable + ' = ' + __dumpValue(variables[variable]) + ';';
            }
        }
        return variableDeclStatements;
    }

    function clickElementById(id) {
        var tid = __gentid();
        var statement = 'document.getElementById("' + id + '").click();';

        webview.experimental.evaluateJavaScript(__wrapJsCommands(statement),
		function(result) { root.resultUpdated(root.__createResult(result)); });
    }

    function evalInPageUnsafe(expr) {
        var tid = __gentid();

        webview.experimental.evaluateJavaScript(__wrapJsCommands(expr),
		function(result) { console.log('result: ' + result); root.resultUpdated(root.__createResult(result)); });
    }

    function clickAnyElementBySelector(selector) {
        var tid = __gentid();
        var statement = 'document.querySelectorAll("' + selector + '")[0].click();';

        webview.experimental.evaluateJavaScript(__wrapJsCommands(statement),
		function(result) { root.resultUpdated(root.__createResult(result)); });
    }

    function elementWithIdHasAttribute(id,attribute,value) {
        var tid = __gentid();
        function __hasAttributeWithId() {
            try { return document.querySelector('#' + id).getAttribute(attribute) === value; } catch (e) {};
            return false;
        };

        var statement = __setupClosedVariables({'id': id, 'attribute': attribute, 'value': value});
        statement += __hasAttributeWithId.toString();
        statement += "; return __hasAttributeWithId(id,attribute,value); "

        webview.experimental.evaluateJavaScript(__wrapJsCommands(statement),
		function(result) { root.resultUpdated(root.__createResult(result, tid)); });
    }

    function isNodeWithIdVisible(id) {
        var tid = __gentid();
        function __isNodeWithIdVisible() {
            try { return document.getElementById(id).style.display !== "none"; } catch (e) { return e.toString(); };
            return false;
        };

        var statement = __setupClosedVariables({'id': id});
        statement += __isNodeWithIdVisible.toString();
        statement += "; return __isNodeWithIdVisible(id); "
	
        webview.experimental.evaluateJavaScript(__wrapJsCommands(statement),
		function(result) { root.resultUpdated(root.__createResult(result, tid)); });
    }

    function getAttributeForElementWithId(id,attribute) {
        var tid = __gentid();
        function __getAttributeWithId() {
            try { return document.querySelector('#' + id).getAttribute(attribute); } catch (e) {};
            return undefined;
        };

        var statement = __setupClosedVariables({'id': id, 'attribute': attribute});
        statement += __getAttributeWithId.toString();
        statement += "; return __getAttributeWithId(id,attribute,value); "

        webview.experimental.evaluateJavaScript(__wrapJsCommands(statement),
		function(result) { root.resultUpdated(root.__createResult(result, tid)); });
    }

    WebView {
        objectName: "webview"
        id: webview

        url: parent.url
        width: parent.width

        anchors {
            top: parent.top
            bottom: addressbar.top
            right: parent.right
            left: parent.left
        }

        height: parent.height - 100

        experimental.userScripts: []
        experimental.preferences.navigatorQtObjectEnabled: true
        experimental.preferences.developerExtrasEnabled: true

        experimental.userAgent: {
            return "Mozilla/5.0 (iPad; CPU OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3"
        }
    }

    TextInput {
        id: addressbar
        objectName: "addressbar"

        width: parent.width - 100
        height: parent.height - 100

        inputMethodHints: Qt.ImhNoPredictiveText | Qt.ImhUrlCharactersOnly
        focus: true
        enabled: true
        readOnly: false

        color: "red"

        anchors {
            top: webview.bottom
            bottom: parent.bottom
            left: parent.left
        }

        Rectangle {
            objectName: "browseButton"
            id: browseButton

            border.color: "black"
            border.width: 5

            width: 100
            height: 100

            anchors {
                top: parent.top
                bottom: parent.bottom
                left: parent.right
            }

            MouseArea {
                anchors.fill: parent
                onClicked: {
                    root.url = addressbar.text
                }
            }
        }
    }
}

