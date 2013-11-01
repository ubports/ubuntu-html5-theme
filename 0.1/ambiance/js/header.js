/*
 * Copyright (C) 2013 Adnane Belmadiaf <daker@ubuntu.com>
 * License granted by Canonical Limited
 *
 * This file is part of ubuntu-html5-theme.
 *
 * This package is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as 
 * published by the Free Software Foundation; either version 3 of the 
 * License, or
 * (at your option) any later version.
 
 * This package is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 
 * You should have received a copy of the GNU Lesser General Public 
 * License along with this program. If not, see 
 * <http://www.gnu.org/licenses/>.
 */

/**
 * An Ubuntu Header wraps Tabs. Together they provide the main navigation widget at the top of an Ubuntu HTML5 app.

Declare the Header and its Tabs in HTML as a direct child of the top level Page as a sibling to the <em>content</em> div.
######Contained list provides Page navigation
A contained unordered list has list items, each of which has an anchor (&lt;a&gt;) whose <em>href</em> attribute is a hash char ("#") followed by a Page ID. Clicking the Header/Tabs allows the user to navigate to the Pages identified by these IDs.

 * @class Header
 * @constructor
 * @namespace UbuntuUI
 * @example
      <body>
        <div data-role="page">
          <header data-role="header" id="headerID">
            <div class="tabs-inner">
              <ul data-role="tabs">
                <li class="active" data-role="tab">
                  <a href="#main">Main</a>
                </li>
                <li data-role="tab">
                  <a href="#page2">Two</a>
                </li>
              </ul>
            </div>
          </header>
          <div data-role="content">
            [...]
          </div>
        </div>
      </body>

      JavaScript access:
      var header = UI.header("headerID");
 */
var Header= function (id) {
    this.id =  id;
};

Header.prototype = {
    /**
     * Placeholder for future methods
     */
};