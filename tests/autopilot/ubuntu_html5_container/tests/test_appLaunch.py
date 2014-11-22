# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2014 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License version 3, as
# published by the Free Software Foundation.

from __future__ import absolute_import

from testtools.matchers import NotEquals

from ubuntu_html5_container.tests import UbuntuHtml5LauncherTestCase


class UbuntuHtml5LauncherAppLaunchTestCase(UbuntuHtml5LauncherTestCase):
    def setUp(self):
        super(UbuntuHtml5LauncherAppLaunchTestCase, self).setUp()

    def test_launcher_succeeds_with_no_www(self):
        self.launch_with_argument('')
        self.assertThat(self.get_app(), NotEquals(None))
