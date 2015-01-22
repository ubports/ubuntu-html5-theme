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
import QtTest 1.0
import com.canonical.Oxide 1.0 as Oxide

Item {
    id: root
    objectName: "webviewContainer"

    width: 640
    height: 640

    property string url

    signal resultUpdated(string message)

    TestResult { id: qtest_testResult }

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

        var result = webview.evaluateCode(statement, true);
        root.resultUpdated(root.__createResult(result, tid));
    }

    function evalInPageUnsafe(expr) {
        var result = webview.evaluateCode(expr, true);
        console.log('result: ' + result)
        root.resultUpdated(result ? result.toString() : result)
    }

    function clickAnyElementBySelector(selector) {
        var tid = __gentid();
        var statement = 'document.querySelectorAll("' + selector + '")[0].click();';

        var result = webview.evaluateCode(statement, true);
        root.resultUpdated(root.__createResult(result, tid));
    }

    function elementWithIdHasAttribute(id,attribute,value) {
        var tid = __gentid();
	var hasAttributeWithIdFunc = '
        function __hasAttributeWithId() {
            try { return document.querySelector("#" + id).getAttribute(attribute) === value; } catch (e) {};
            return false;
        };';

        var statement = __setupClosedVariables({'id': id, 'attribute': attribute, 'value': value});
        statement += hasAttributeWithIdFunc;
        statement += "; return __hasAttributeWithId(id,attribute,value); "

        var result = webview.evaluateCode(statement, true);
        root.resultUpdated(root.__createResult(result, tid));
    }

    function isNodeWithIdVisible(id) {
        var tid = __gentid();
        var isNodeWithIdVisibleFunc = '
        function __isNodeWithIdVisible() {
            try { return document.getElementById(id).style.display !== "none"; } catch (e) { return e.toString(); };
            return false;
        };';

        var statement = __setupClosedVariables({'id': id});
        statement += isNodeWithIdVisibleFunc;
        statement += "; return __isNodeWithIdVisible(id); "

        var result = webview.evaluateCode(statement, true);
        root.resultUpdated(root.__createResult(result, tid));
    }

    function getAttributeForElementWithId(id,attribute) {
        var tid = __gentid();
        var getAttributeWithIdFunc = '
        function __getAttributeWithId() {
            try { var value = document.querySelector("#" + id).getAttribute(attribute); return value || ""; } catch (e) { return e.toString(); };
            return "";
        };';

        var statement = __setupClosedVariables({'id': id, 'attribute': attribute});
        statement += getAttributeWithIdFunc;
        statement += "; return __getAttributeWithId(); "

        var result = webview.evaluateCode(statement, true);
        root.resultUpdated(root.__createResult(result, tid));
    }

    Oxide.WebView {
        objectName: "webview"
        id: webview

        url: parent.url

        width: parent.width
        height: parent.height - 100

        anchors {
            top: parent.top
            bottom: addressbar.top
            right: parent.right
            left: parent.left
        }

        preferences.localStorageEnabled: true
        preferences.appCacheEnabled: true

        function evaluateCode(code, wrap) {
          var value = webview._waitForResult(
              webview.rootFrame.sendMessage(
                "oxide://main-world",
                "EVALUATE-CODE",
                { code: code,
                  wrap: wrap === undefined ? false : wrap }));
            return value ? value.result : undefined;
        }

        function _waitForResult(req, timeout) {
          var result;
          var error;
          req.onreply = function(response) {
              result = response;
              error = 0;
          };
          req.onerror = function(error_code, msg) {
              result = msg;
              error = error_code;
          };
          webview._waitFor(function() { return error !== undefined; },
                                timeout);

          if (error > 0) {
              console.error('Error:' + error + ', result:' + result)
          } else if (error === 0) {
              return result;
          } else {
              throw new Error("Message call timed out");
          }
        }

        function _waitFor(predicate, timeout) {
          timeout = timeout || 5000000;
          var end = Date.now() + timeout;
          var i = Date.now();
          while (i < end && !predicate()) {
              qtest_testResult.wait(50);
              i = Date.now();
          }
          return predicate();
        }

        context: Oxide.WebContext {
            userScripts: [
                Oxide.UserScript {
                    context: "oxide://main-world"
                    emulateGreasemonkey: true
                    url: Qt.resolvedUrl("message-server.js")
                    matchAllFrames: true
                }
            ]
        }

        onJavaScriptConsoleMessage: {
            var msg = "[JS] (%1:%2) %3".arg(sourceId).arg(lineNumber).arg(message)
            if (level === Oxide.WebView.LogSeverityVerbose) {
                console.log(msg)
            } else if (level === Oxide.WebView.LogSeverityInfo) {
                console.info(msg)
            } else if (level === Oxide.WebView.LogSeverityWarning) {
                console.warn(msg)
            } else if ((level === Oxide.WebView.LogSeverityError) ||
                       (level === Oxide.WebView.LogSeverityErrorReport) ||
                       (level === Oxide.WebView.LogSeverityFatal)) {
                console.error(msg)
            }
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

