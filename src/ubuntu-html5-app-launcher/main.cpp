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

    // Note: By default we add the local path to the import path
    //  mostly to account for potential Cordova 3.0 qml plugin
    //  not installed globally but embedded into apps. So the
    //  one embedded should take precedence over the ones installed
    //  system wide (2.8).
    addPathToQmlImport(".");

    qDebug() << "Setting import path to: "
             << qgetenv("QML2_IMPORT_PATH").data();
}

QString pluginPathForCurrentArchitecture()
{
#if defined(__i386__)
    return QLatin1String("/lib/i386-linux-gnu");
#elif defined(__x86_64__)
    return QLatin1String("/lib/x86_64-linux-gnu");
#elif defined(__arm__)
    return QLatin1String("/lib/arm-linux-gnueabihf");
#else
#error Unable to determine target architecture
#endif
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

    setUpQmlImportPathIfNecessary();

    const QString WWW_LOCATION_ARG_HEADER = "--www=";
    const QString MAXIMIZED_ARG_HEADER = "--maximized";
    const QString ARG_HEADER = "--";
    const QString VALUE_HEADER = "=";
    const QString INSPECTOR = "--inspector";

    QHash<QString, QString> properties;
    QString wwwfolderArg;
    bool maximized = false;

    QStringList arguments = app.arguments();
    arguments.pop_front();

    Q_FOREACH(QString argument, arguments)
    {
        if (argument.contains(WWW_LOCATION_ARG_HEADER))
        {
            wwwfolderArg = argument.right(argument.count() - WWW_LOCATION_ARG_HEADER.count());
        }
        else
        if (argument.contains(MAXIMIZED_ARG_HEADER))
        {
            maximized = true;
        }
        else
        if (argument.contains(INSPECTOR))
        {
            QString host;
            Q_FOREACH(QHostAddress address, QNetworkInterface::allAddresses()) {
                if (!address.isLoopback() && (address.protocol() == QAbstractSocket::IPv4Protocol)) {
                    host = address.toString();
                    break;
                }
            }
            QString server;
            if (host.isEmpty()) {
                server = QString::number(REMOTE_INSPECTOR_PORT);
            } else {
                server = QString("%1:%2").arg(host, QString::number(REMOTE_INSPECTOR_PORT));
            }
            qputenv("QTWEBKIT_INSPECTOR_SERVER", server.toUtf8());
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

    QString plugin_path = wwwFolder.absoluteFilePath() +
        pluginPathForCurrentArchitecture();

    QQuickView view;
    view.engine()->addPluginPath(plugin_path);    
    view.setSource(QUrl::fromLocalFile(Webapp::Config::getContainerMainQmlPath()
                                          + "/main.qml"));
    if (view.status() != QQuickView::Ready)
    {
        qWarning() << "Component not ready";
        return EXIT_FAILURE;
    }
    
    QQuickItem *object = view.rootObject();
    if ( ! object)
    {
        qCritical() << "Cannot create object from qml base file";
        return EXIT_FAILURE;
    }

    QQuickWindow* window = qobject_cast<QQuickWindow*>(&view);

    object->setProperty("htmlIndexDirectory", wwwFolder.absoluteFilePath());

    QHash<QString, QString>::iterator it;
    for(it = properties.begin();
        properties.end() != it;
        ++it)
    {
        const char * const pname = it.key().toStdString().c_str();
        if (object->property(pname).isValid())
            object->setProperty(pname, it.value());
    }

    if (window)
    {
        if (maximized)
            window->showMaximized();
        else
            window->show();
    }

    return app.exec();
}



