# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2014 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License version 3, as
# published by the Free Software Foundation.

from __future__ import absolute_import

from testtools.matchers import Equals
from autopilot.matchers import Eventually

from ubuntu_html5_ui_toolkit.tests import UbuntuHTML5TestCaseBase


class UbuntuUIToolkitTabsTestCase(UbuntuHTML5TestCaseBase):

    def setUp(self):
        super(UbuntuUIToolkitTabsTestCase, self).setUp()

    def test_programaticTabSelectIndex(self):
        self.browse_to_test_html('test-tabs-in-app.html')
        self.assertThat(
            self.eval_expression_in_page_unsafe(
                'var UI = new UbuntuUI(); '
                'UI.init(); UI.tabs.selectedTabIndex = 1; '
                'return "ok";'),
            Equals('ok'))

        self.assertThat(
            lambda: self.is_dom_node_visible('tab1'),
            Eventually(Equals(False)))
        self.assertThat(
            lambda: self.is_dom_node_visible('tab2'),
            Eventually(Equals(True)))
        self.assertThat(
            lambda: self.is_dom_node_visible('tab3'),
            Eventually(Equals(False)))

        self.assertThat(
            self.eval_expression_in_page_unsafe(
                'return document.getElementById("tab2").style.display;'),
            Equals('block'))
