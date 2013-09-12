import QtQuick 2.0
import QtWebKit 3.0

Item {
     width: 800
     height: 600
     
     WebView {
     	     anchors.fill: parent
	     url: '../index.html'
     }
}