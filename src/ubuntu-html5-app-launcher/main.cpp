/*
 * Copyright 2013 Canonical Ltd.
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

#include "config.h"

#include <QGuiApplication>
#include <QtNetwork/QNetworkInterface>
#include <QtQuick/QQuickItem>
#include <QtQuick/QQuickView>
#include <QDebug>
#include <QFileInfo>
#include <QLibrary>
#include <QQmlEngine>
#include <QQmlContext>
#include <QQmlComponent>
#if QT_VERSION < QT_VERSION_CHECK(5, 3, 0)
#include <QtQuick/private/qsgcontext_p.h>
#else
#include <QtGui/private/qopenglcontext_p.h>
#endif


namespace {

void loadQtTestability(const QStringList & arguments)
{
    // The testability driver is only loaded
    // by QApplication but not by QGuiApplication.
    // However, QApplication depends on QWidget which
    // would add some unneeded overhead => Let's load the testability driver on our own.

    if (arguments.contains(QLatin1String("-testability"))) {
        QLibrary testLib(QLatin1String("qttestability"));

        if (testLib.load()) {
            typedef void (*TasInitialize)(void);
            TasInitialize initFunction = (TasInitialize)testLib.resolve("qt_testability_init");
            if (initFunction) {
                initFunction();
            } else {
                qCritical("Library qttestability resolve failed!");
            }
        } else {
            qCritical("Library qttestability load failed!");
        }
    }
}

} // namespace


void addPathToQmlImport(const QString & importPath)
{
    QString existingImportPath (qgetenv("QML2_IMPORT_PATH"));

    existingImportPath = existingImportPath.trimmed();
    if ( ! existingImportPath.trimmed().isEmpty())
       existingImportPath.append(":");

    existingImportPath.append(importPath);

    qputenv("QML2_IMPORT_PATH", existingImportPath.toLatin1());
}

void setUpQmlImportPathIfNecessary()
{
    QString importPath = Webapp::Config::getContainerImportPath();
    if ( !importPath.isEmpty())
    {
        addPathToQmlImport(importPath);
    }

    qDebug() << "Setting import path to: "
             << qgetenv("QML2_IMPORT_PATH").data();
}


void usage()
{
    QTextStream out(stdout);
    QString command = QFileInfo(QCoreApplication::applicationFilePath()).fileName();
    out << "Usage: "
        << command
        << " [-h|--help] [--www=<index.html folder>] [--inspector]" << endl;
    out << "Options:" << endl;
    out << "  -h, --help                     display this help message and exit" << endl;
    out << "  --www=PATH                     relative or absolute path to the 'index.html' root file" << endl;
    out << "  --maximized                    maximize the app window at startup time" << endl;
    out << "  --inspector                    run a remote inspector on port "
        << REMOTE_INSPECTOR_PORT << endl;
}

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    if (!app.arguments().count())
    {
        qCritical() << "Invalid inputs args";
        usage();
        return EXIT_FAILURE;
    }

    loadQtTestability(app.arguments());

    const QString WWW_LOCATION_ARG_HEADER = "--www=";
    const QString MAXIMIZED_ARG_HEADER = "--maximized";
    const QString ARG_HEADER = "--";
    const QString VALUE_HEADER = "=";
    const QString INSPECTOR = "--inspector";

    QString wwwfolderArg;
    bool maximized = false;

    QString remoteInspectorHost = "";
    QString remoteInspectorPort = QString::number(REMOTE_INSPECTOR_PORT);
    bool remoteInspectorEnabled = false;

    QStringList arguments = app.arguments();
    arguments.pop_front();

    Q_FOREACH(QString argument, arguments)
    {
        if (argument.contains(WWW_LOCATION_ARG_HEADER))
        {
            wwwfolderArg = argument.split(WWW_LOCATION_ARG_HEADER)[1];
        }
        else
        if (argument.contains(MAXIMIZED_ARG_HEADER))
        {
            maximized = true;
        }
        else
        if (argument.contains(INSPECTOR))
        {
            remoteInspectorEnabled = true;
            Q_FOREACH(QHostAddress address, QNetworkInterface::allAddresses()) {
                if (!address.isLoopback() && (address.protocol() == QAbstractSocket::IPv4Protocol)) {
                    remoteInspectorHost = address.toString();
                    break;
                }
            }
            if (argument.startsWith(INSPECTOR + "=")) {
                remoteInspectorPort = argument.split(INSPECTOR + "=")[1];
            }
        }
        else
        {
            qDebug() << "Ignoring argument: " << argument;
        }
    }

    if (wwwfolderArg.isEmpty())
    {
        wwwfolderArg = QDir::currentPath();
        qDebug() << "No (or empty) WWW folder path specified." << endl
                 << "Defaulting to the current directory:" << wwwfolderArg;
    }

    QFileInfo wwwFolder(wwwfolderArg);
    if (wwwFolder.isRelative())
    {
        wwwFolder.makeAbsolute();
    }

    if (!wwwFolder.exists() || !wwwFolder.isDir())
    {
        qCritical() << "WWW folder not found or not a proper directory: "
                    << wwwFolder.absoluteFilePath();
        return EXIT_FAILURE;
    }

    // set the current directory to the project/application folder
    // to help use relative paths for the embedded js components as well
    QDir::setCurrent(wwwFolder.absoluteFilePath());

    // Ensure that application-specific data is written where it ought to.
    if (qgetenv("APP_ID").data() != NULL)
    {
        QString appPkgName = qgetenv("APP_ID").split('_').first();
        QCoreApplication::setApplicationName(appPkgName);
    }
    setUpQmlImportPathIfNecessary();

    // Enable compositing in oxide
    QOpenGLContext* glcontext = new QOpenGLContext();
    glcontext->create();
#if QT_VERSION < QT_VERSION_CHECK(5, 3, 0)
    QSGContext::setSharedOpenGLContext(glcontext);
#elif QT_VERSION < QT_VERSION_CHECK(5, 4, 0)
    QOpenGLContextPrivate::setGlobalShareContext(glcontext);
#else
    qt_gl_set_global_share_context(glcontext);
#endif

    QQuickView view;
    QQmlEngine* engine = view.engine();

    if (remoteInspectorEnabled) {
        qputenv("UBUNTU_WEBVIEW_DEVTOOLS_HOST", remoteInspectorHost.toUtf8());
        qputenv("UBUNTU_WEBVIEW_DEVTOOLS_PORT", remoteInspectorPort.toUtf8());
    }

    engine->rootContext()->setContextProperty("inspector", remoteInspectorEnabled);
    engine->rootContext()->setContextProperty("wwwFolder", wwwFolder.absoluteFilePath());

    if (remoteInspectorEnabled) {
        qputenv("QTWEBKIT_INSPECTOR_SERVER", remoteInspectorPort.toUtf8());
    }

    view.setSource(QUrl::fromLocalFile(Webapp::Config::getContainerMainQmlPath()
                                          + "/main.qml"));
    if (view.status() != QQuickView::Ready)
    {
        qCritical() << "Main application component cannot be loaded.";
        return EXIT_FAILURE;
    }

    view.setTitle(QCoreApplication::applicationName());
    view.setResizeMode(QQuickView::SizeRootObjectToView);

    QObject::connect(view.engine(), SIGNAL(quit()), &app, SLOT(quit()));

    if (maximized)
        view.showMaximized();
    else
        view.show();

    return app.exec();
}
