import QtQuick 2.0
import Ubuntu.Components 0.1
import CordovaUbuntu 2.8


/*!
    \qmltype WebAppContainer
    \inqmlmodule Ubuntu.WebApps 0.1
    \ingroup ubuntu
    \brief WebAppContainer is the root Item that should be used for all HTML5 applications.
*/
MainView {
    id: root
    objectName: "root"

    /*!
      \preliminary
      The property holds the path to the filesystem location where the 'index.html'
      file can be found (root of the HTML5 application).

      The path is absolute.
      */
    property alias htmlIndexDirectory: view.wwwDir

    /*!
      \internal
     */
    CordovaView {
        id: view
        objectName: "view"

        anchors.fill: parent
    }
}

