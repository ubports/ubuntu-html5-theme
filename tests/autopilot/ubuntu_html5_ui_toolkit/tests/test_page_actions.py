# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License version 3, as
# published by the Free Software Foundation.

from __future__ import absolute_import

from testtools.matchers import Equals, NotEquals
from autopilot.matchers import Eventually

from ubuntu_html5_ui_toolkit.tests import UbuntuHTML5TestCaseBase


class UbuntuThemePageStackTestCase(UbuntuHTML5TestCaseBase):

    def setUp(self):
        super(UbuntuThemePageStackTestCase, self).setUp()

    def test_tabWithActions(self):
        self.browse_to_test_html('test-page-actions.html')
        self.eval_expression_in_page_unsafe(
            'var UI = new UbuntuUI(); UI.init();'),
        self.assertThat(
            self.eval_expression_in_page_unsafe(
                'return document.querySelector(\'[data-role="actions"]\') != null;'),
            Equals('true'))
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                'return document.getElementById("addfeed").parentNode.style.display;'),
            Eventually(NotEquals('none')))

    def test_noActions(self):
        self.browse_to_test_html('test-pagestack-in-app.html')
        self.assertThat(
            self.eval_expression_in_page_unsafe(
                'var UI = new UbuntuUI(); UI.init(); return "ok";'),
            Equals('ok'))
        self.assertThat(
            self.eval_expression_in_page_unsafe(
                'return document.querySelector(\'[data-role="actions"]\') != null;'),
            Equals('false'))
