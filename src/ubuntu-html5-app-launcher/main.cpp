/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of ubuntu-html5-theme.
 *
 * ubuntu-html5-theme is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * ubuntu-html5-theme is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#include "config.h"

#include <QGuiApplication>
#include <QtQuick/QQuickItem>
#include <QtQuick/QQuickView>
#include <QDebug>
#include <QFileInfo>
#include <QLibrary>
#include <QQmlEngine>
#include <QQmlContext>
#include <QQmlComponent>


void setUpQmlImportPathIfNecessary()
{
    QString importPath = Webapp::Config::getContainerImportPath();
    if ( !importPath.isEmpty())
    {
        QString existingImportPath (qgetenv("QML2_IMPORT_PATH"));
        existingImportPath = existingImportPath.trimmed();

        if ( ! existingImportPath.trimmed().isEmpty())
           existingImportPath.append(":");
        existingImportPath.append(importPath);

        qDebug() << "Setting import path to: " << existingImportPath;

        qputenv("QML2_IMPORT_PATH", existingImportPath.toLatin1());
    }
}

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    if (!app.arguments().count())
    {
        qCritical() << "Invalid inputs args";
        return EXIT_FAILURE;
    }
    const QString WWW_LOCATION_ARG_HEADER = "--www=";
    const QString MAXIMIZED_ARG_HEADER = "--maximized";
    const QString ARG_HEADER = "--";
    const QString VALUE_HEADER = "=";

    QHash<QString, QString> properties;
    QString wwwfolder;
    bool maximized = false;

    QStringList arguments = app.arguments();
    arguments.pop_front();
    Q_FOREACH(QString argument, arguments)
    {
        if (argument.contains(WWW_LOCATION_ARG_HEADER))
        {
            wwwfolder = argument.right(argument.count() - WWW_LOCATION_ARG_HEADER.count());
        }
        else
        if (argument.contains(MAXIMIZED_ARG_HEADER))
        {
            maximized = true;
        }
        else
        if (argument.startsWith(ARG_HEADER)
            && argument.right(argument.count() - ARG_HEADER.count()).contains("="))
        {
            QString property = argument.right(argument.count() - ARG_HEADER.count());
            property = property.left(property.indexOf(VALUE_HEADER));
            if (property.isEmpty())
                continue;

            QString value = argument.right(argument.count() - argument.indexOf(VALUE_HEADER) - 1);
            if (value.isEmpty())
                continue;

            qDebug() << "Adding property: "
                     << property
                     << ", "
                     << "value: "
                     << value;

            properties.insert(property, value);
        }
        else
        {
            qDebug() << "Ignoring argument: " << argument;
        }
    }

    if (wwwfolder.isEmpty())
    {
        qCritical() << "No (or empty) WWW folder path specified";
        return EXIT_FAILURE;
    }

    QFileInfo f(wwwfolder);
    if (f.isRelative())
    {
        f.makeAbsolute();
    }
    if (!f.exists() || !f.isDir())
    {
        qCritical() << "WWW folder not found or not a proper directory: " << wwwfolder;
        return EXIT_FAILURE;
    }

    setUpQmlImportPathIfNecessary();

    QQuickView view;
    view.setSource(QUrl::fromLocalFile(Webapp::Config::getContainerMainQmlPath()
                                          + "/main.qml"));

    if (view.status() != QQuickView::Ready)
    {
        qWarning() << "Component not ready";
        return -1;
    }

    
    QQuickItem *object = view.rootObject();
    if ( ! object)
    {
        qCritical() << "Cannot create object from qml base file";
        return -1;
    }

    QQuickWindow* window = qobject_cast<QQuickWindow*>(&view);

    object->setProperty("htmlIndexDirectory", wwwfolder);

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



