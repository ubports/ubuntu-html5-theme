from __future__ import absolute_import

from testtools.matchers import Contains, Equals
from autopilot.matchers import Eventually

from ubuntu_html5_theme.tests import UbuntuThemeRemotePageTestCaseBase

class UbuntuThemeRSSReaderTestCase(UbuntuThemeRemotePageTestCaseBase):
    def setUp(self):
        super(UbuntuThemeRSSReaderTestCase, self).setUp()
        self.browse_to_app('rss-reader')

    def test_appDoesLoads(self):
        self.assertThat(self.get_title(), Contains("RSS Mobile Reader"))


