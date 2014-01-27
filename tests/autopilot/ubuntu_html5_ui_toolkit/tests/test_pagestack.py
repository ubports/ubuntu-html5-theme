# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License version 3, as published
# by the Free Software Foundation.

from __future__ import absolute_import

import time

from testtools.matchers import Contains, Equals
from autopilot.matchers import Eventually

from ubuntu_html5_ui_toolkit.tests import UbuntuHTML5TestCaseBase, UbuntuThemeRemotePageTestCaseBase

class UbuntuThemePageStackTestCase(UbuntuHTML5TestCaseBase):

    def setUp(self):
        super(UbuntuThemePageStackTestCase, self).setUp()

    def test_pageLoadsWithNoPageStacks(self):
        self.browse_to_test_html('test-nopagestack-in-app.html')
        self.assertThat(self.eval_expression_in_page_unsafe('var UI = new UbuntuUI(); UI.init(); return "ok";'), Equals('ok'));

    def test_pageLoadsWithPageStacks(self):
        self.browse_to_test_html('test-pagestack-in-app.html')
        self.assertThat(self.eval_expression_in_page_unsafe('var UI = new UbuntuUI(); UI.init(); return "ok";'), Equals('ok'));
        self.assertThat(self.is_dom_node_visible('main'), Equals(True))

    def test_pageChangeWithPageStackPush(self):
        self.browse_to_test_html('test-pagestack-in-app.html')
        self.assertThat(self.eval_expression_in_page_unsafe('var UI = new UbuntuUI(); UI.init(); UI.pagestack.push("results"); return "ok";'), Equals('ok'));
        self.assertThat(self.is_dom_node_visible('main'), Equals(False))
        self.assertThat(self.is_dom_node_visible('results'), Equals(True))

    def test_pageChangeWithPageStackPopped(self):
        self.browse_to_test_html('test-pagestack-in-app.html')
        self.assertThat(self.eval_expression_in_page_unsafe('var UI = new UbuntuUI(); UI.init(); UI.pagestack.push("main"); UI.pagestack.push("results"); UI.pagestack.push("article"); UI.pagestack.pop(); return "ok";'), Equals('ok'));
        self.assertThat(self.is_dom_node_visible('main'), Equals(False))
        self.assertThat(self.is_dom_node_visible('results'), Equals(True))
        self.assertThat(self.is_dom_node_visible('article'), Equals(False))
