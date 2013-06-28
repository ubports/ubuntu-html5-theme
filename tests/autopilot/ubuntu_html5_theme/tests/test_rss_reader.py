from __future__ import absolute_import

import time

from testtools.matchers import Contains, Equals
from autopilot.matchers import Eventually

from ubuntu_html5_theme.tests import UbuntuHTML5TestCaseBase, UbuntuThemeRemotePageTestCaseBase

class UbuntuThemeRSSReaderTestCase(UbuntuHTML5TestCaseBase):
    def setUp(self):
        super(UbuntuThemeRSSReaderTestCase, self).setUp()
        self.browse_to_app('rss-reader')

    def test_appDoesLoads(self):
        self.assertThat(self.get_title(), Contains("RSS Mobile Reader"))

    def test_initialState(self):
        self.assertThat(self.is_dom_node_visible('main'), Equals(True))
        self.assertThat(self.is_dom_node_visible('article'), Equals(False))
        self.assertThat(self.is_dom_node_visible('results'), Equals(False))

    def test_switchToFeedView(self):
        self.click_any_dom_node_by_selector('#yourfeeds li a')
        self.assertThat(lambda: self.is_dom_node_visible('main'), Eventually(Equals(False)))
        self.assertThat(self.is_dom_node_visible('article'), Equals(False))
        self.assertThat(self.is_dom_node_visible('results'), Equals(True))



