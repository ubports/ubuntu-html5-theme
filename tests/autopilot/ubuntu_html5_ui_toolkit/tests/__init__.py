# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License version 3, as published
# by the Free Software Foundation.

"""Tests for the Ubuntu HTML5 package """

import os
import json
import BaseHTTPServer
import threading
import subprocess

HTTP_SERVER_PORT = 8383

from testtools.matchers import Contains, Equals, GreaterThan
from autopilot.matchers import Eventually
from autopilot.testcase import AutopilotTestCase
from autopilot.input import Mouse, Touch, Pointer

from autopilot import platform

# from autopilot.introspection.qt import QtIntrospectionTestMixin


class RequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    BASE_PATH_FOR_SERVED_APPS = {'rss-reader': "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../../../0.1/examples/apps/rss-reader')}

    def get_served_filename(self, appname, filename):
        if len(filename) == 0 or filename == '/':
            filename = 'autopilot.html'
        print os.path.join(self.BASE_PATH_FOR_SERVED_APPS[appname], filename)
        return os.path.join(self.BASE_PATH_FOR_SERVED_APPS[appname], filename)

    def serve_file(self, filename):
        import mimetypes

        content_type = mimetypes.guess_type(filename)[0]

        f = open(filename, 'rb')
        self.send_response(200)
        self.send_header('Content-length', os.fstat(f.fileno())[6])
        self.send_header('Content-type', content_type)
        self.end_headers()
        self.wfile.write(f.read())

    def do_GET(self):
        # FIXME: more generic & cleaner
        if self.path.startswith('/rss-reader'):
            filename = self.path[len('/rss-reader'):]
            self.send_response(200)
            self.serve_file(self.get_served_filename('rss-reader', filename))
        else:
            self.send_error(404)


class UbuntuHTML5HTTPServer(threading.Thread):
    def __init__(self, port):
        super(UbuntuHTML5HTTPServer, self).__init__()
        self.server = BaseHTTPServer.HTTPServer(("", port), RequestHandler)
        self.server.allow_reuse_address = True

    def run(self):
        self.server.serve_forever()

    def shutdown(self):
        self.server.shutdown()
        self.server.server_close()


class UbuntuHTML5TestCaseBase(AutopilotTestCase):
    BROWSER_CONTAINER_PATH = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../tools/qml/webview.qml')
    INSTALLED_BROWSER_CONTAINER_PATH = '/usr/share/ubuntu-html5-ui-toolkit/tests/tools/qml/webview.qml'
    arch = subprocess.check_output(
        ["dpkg-architecture", "-qDEB_HOST_MULTIARCH"]).strip()
    BROWSER_QML_APP_LAUNCHER = "/usr/lib/" + arch + "/qt5/bin/qmlscene"

    # TODO: fix version
    LOCAL_HTML_EXAMPLES_PATH = os.path.abspath("%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../../'))
    INSTALLED_HTML_EXAMPLES_PATH = '/usr/share/ubuntu-html5-ui-toolkit/tests/'

    APPS_SUBFOLDER_NAME = 'apps'

    BASE_PATH = ''

    def get_browser_container_path(self):
        if os.path.exists(self.BROWSER_CONTAINER_PATH):
            return self.BROWSER_CONTAINER_PATH
        return self.INSTALLED_BROWSER_CONTAINER_PATH

    def create_file_url_from(self, filepath):
        return 'file://' + filepath

    def setup_base_path(self):
        if os.path.exists(self.LOCAL_HTML_EXAMPLES_PATH):
            self.BASE_PATH = self.LOCAL_HTML_EXAMPLES_PATH
        else:
            self.BASE_PATH = self.INSTALLED_HTML_EXAMPLES_PATH

    def setUp(self):
        self.setup_base_path()
        if platform.model() == "Desktop":
            self.pointer = Pointer(Mouse.create())
        else:
            self.pointer = Pointer(Touch.create())

        params = [self.BROWSER_QML_APP_LAUNCHER, self.get_browser_container_path()]
        if (platform.model() <> 'Desktop'):
            params.append('--desktop_file_hint=/usr/share/applications/unitywebappsqmllauncher.desktop')

        self.app = self.launch_test_application(
            *params,
            app_type='qt')

        self.webviewContainer = self.get_webviewContainer()
        self.watcher = self.webviewContainer.watch_signal('resultUpdated(QString)')
        super(UbuntuHTML5TestCaseBase, self).setUp()

    def tearDown(self):
        super(UbuntuHTML5TestCaseBase, self).tearDown()

    def pick_app_launcher(self, app_path):
        # force Qt app introspection:
        from autopilot.introspection.qt import QtApplicationLauncher
        return QtApplicationLauncher()

    def get_webviewContainer(self):
        return self.app.select_single(objectName="webviewContainer")

    def get_webview(self):
        return self.app.select_single(objectName="webview")

    def get_addressbar(self):
        return self.app.select_single(objectName="addressbar")

    def get_button(self):
        return self.app.select_single(objectName="browseButton")

    def get_title(self):
        return self.get_webview().title

    def assert_url_eventually_loaded(self, url):
        webview = self.get_webview()
        self.assertThat(webview.loadProgress, Eventually(Equals(100)))
        self.assertThat(webview.loading, Eventually(Equals(False)))
        self.assertThat(webview.url, Eventually(Equals(url)))

    def click_dom_node_with_id(self, id):
        webview = self.get_webviewContainer()
        webview.slots.clickElementById(id)
        self.assertThat(lambda: self.watcher.num_emissions, Eventually(Equals(1)))

    def click_any_dom_node_by_selector(self, selector):
        webview = self.get_webviewContainer()
        webview.slots.clickAnyElementBySelector(selector)
        self.assertThat(lambda: self.watcher.num_emissions, Eventually(Equals(1)))

    def is_dom_node_visible(self, id):
        webview = self.get_webviewContainer()
        prev_emissions = self.watcher.num_emissions
        webview.slots.isNodeWithIdVisible(id)
        self.assertThat(lambda: self.watcher.num_emissions, Eventually(GreaterThan(prev_emissions)))
        return json.loads(webview.get_signal_emissions('resultUpdated(QString)')[-1][0])['result']

    def eval_expression_in_page_unsafe(self, expr):
        webview = self.get_webviewContainer()
        prev_emissions = self.watcher.num_emissions
        webview.slots.evalInPageUnsafe(expr)
        self.assertThat(lambda: self.watcher.num_emissions, Eventually(GreaterThan(prev_emissions)))
        return json.loads(webview.get_signal_emissions('resultUpdated(QString)')[-1][0])['result']

    def get_dom_node_id_attribute(self, id, attribute):
        webview = self.get_webviewContainer()
        prev_emissions = self.watcher.num_emissions
        webview.slots.getAttributeForElementWithId(id, attribute)
        self.assertThat(lambda: self.watcher.num_emissions, Eventually(GreaterThan(prev_emissions)))
        return json.loads(webview.get_signal_emissions('resultUpdated(QString)')[-1][0])['result']

    def get_address_bar_action_button(self):
        addressbar = self.get_addressbar()
        return addressbar.select_single(objectName="browseButton")

    def browse_to_url(self, url):
        import time
        addressbar = self.get_addressbar()
        self.assertThat(addressbar.activeFocus, Eventually(Equals(True)))

        self.keyboard.type(url, 0.001)

        self.pointer.click_object(self.get_webview())
        time.sleep(1)

        button = self.get_address_bar_action_button();
        self.pointer.move_to_object(button)
        self.pointer.press()
        time.sleep(1)
        self.pointer.release()

        self.assert_url_eventually_loaded(url);

    def browse_to_app(self, appname):
        appfilepath = os.path.abspath(self.BASE_PATH +
            '/data/html/' +
            self.APPS_SUBFOLDER_NAME +
            '/' +
            appname +
            '/index.html')

        APP_HTML_PATH = self.create_file_url_from(appfilepath)

        self.browse_to_url(APP_HTML_PATH)

    def browse_to_test_html(self, html_filename):
        self.browse_to_url(self.create_file_url_from(os.path.abspath(self.BASE_PATH + '/data/html/' + html_filename)))


class UbuntuThemeWithHttpServerTestCaseBase(UbuntuHTML5TestCaseBase):
    def setUp(self):
        self.server = UbuntuHTML5HTTPServer(HTTP_SERVER_PORT)
        self.server.start()
        super(UbuntuThemeWithHttpServerTestCaseBase, self).setUp()

    def tearDown(self):
        super(UbuntuThemeWithHttpServerTestCaseBase, self).tearDown()
        self.server.shutdown()


class UbuntuThemeRemotePageTestCaseBase(UbuntuThemeWithHttpServerTestCaseBase):
    def setUp(self):
        super(UbuntuThemeRemotePageTestCaseBase, self).setUp()
