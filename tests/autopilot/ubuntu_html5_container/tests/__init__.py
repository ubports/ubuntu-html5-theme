# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2014 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License version 3, as
# published by the Free Software Foundation.

"""Tests for the Ubuntu HTML5 Launcher package """

import os
from autopilot.testcase import AutopilotTestCase


LAUNCHER_EXEC_NAME = 'ubuntu-html5-app-launcher'

LOCAL_LAUNCHER_PATH = os.path.abspath(
    "{}/{}".format(
        os.path.dirname(os.path.realpath(__file__)),
        '../../../../src/ubuntu-html5-app-launcher/' + LAUNCHER_EXEC_NAME))

INSTALLED_LAUNCHER_PATH = '/usr/bin/' + LAUNCHER_EXEC_NAME


class UbuntuHtml5LauncherTestCase (AutopilotTestCase):
    def setUp(self):
        self.app = None
        super(UbuntuHtml5LauncherTestCase, self).setUp()

    def tearDown(self):
        super(UbuntuHtml5LauncherTestCase, self).tearDown()

    def get_launcher_path(self):
        if os.path.exists(LOCAL_LAUNCHER_PATH):
            return LOCAL_LAUNCHER_PATH
        return INSTALLED_LAUNCHER_PATH

    def get_app(self):
        return self.app

    def launch_with_argument(self, args):
        try:
            self.app = self.launch_test_application(
                self.get_launcher_path(),
                args)
        except Exception:
            pass
