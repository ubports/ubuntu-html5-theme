import QtQuick 2.0
import QtWebKit 3.0
import QtWebKit.experimental 1.0

Rectangle {
    id: root
    objectName: "webviewContainer"
    width: 640
    height: 640

    property string url: 'blabla'

    signal messageReceived(string message)

    property var __pendingtx: []

    function __gentid() {
        return Math.random() + '';
    }
    function clickElementById(id) {
        var tid = __gentid();
    	webview.experimental.postMessage(JSON.stringify({click: 1, id: id + '', tid: tid}));
    }
    function elementWithIdHasAttribute(id,attribute,value) {
        var tid = __gentid();
    	webview.experimental.postMessage(JSON.stringify({hasAttribute: 1, id: id + '', attribute: attribute, value: value, tid: tid}));
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

        experimental.userScripts: ['webpage-message-proxy.js']
        experimental.preferences.navigatorQtObjectEnabled: true
        experimental.preferences.developerExtrasEnabled: true

        experimental.userAgent: {
            return "Mozilla/5.0 (iPad; CPU OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3"
        }

        experimental.onMessageReceived: {
	    root.messageReceived(message.data);
        }
    }

    TextInput {
        id: addressbar
	objectName: "addressbar"
	width: parent.width - 100
	height: parent.height - 100

	enabled: true
	color: "red"
	readOnly: false
	selectByMouse: true

	anchors {
	    top: webview.bottom
            bottom: parent.bottom
            right: browseButton.left
            left: parent.left
	}
    }

    MouseArea {
        objectName: "browseButton"
    	id: browseButton
	width: 100
	height: 100

	onClicked: {
	    parent.url = addressbar.text
	}

	anchors {
	    top: webview.bottom
            bottom: parent.bottom
            right: parent.right
            left: addressbar.right
	}
    }   
}

