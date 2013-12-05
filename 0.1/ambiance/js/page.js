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
 * An Ubuntu app consists of a Pagestack containing one or more Pages. Each page displays full-screen. See the Pagestack class.

Each Page must have an <em>id</em> attriubute. This is used to push the Page to the top of the Pagestack (see the Pagestack class).

Navigation between Pages is typically provided by the Header and its Tabs. See the Header class.
 * @class Page
 * @constructor
 * @namespace UbuntuUI
 * @example
      </body>
        <div data-role="page">
          <header data-role="header">
            [...]
          </header>
          <div data-role="content">
            <div data-role="pagestack">
              <div data-role="page" id="main">
                [...]
              </div>
              <div data-role="page" id="ID">
                [...]
              </div>
            </div>
          </div>
        </div>
      </body>

      JavaScript access:
      var page = UI.page("pageID");
 */
var Page = function (id) {
    this.id =  id;
};

Page.prototype = {
    /**
     * Returns the DOM element associated with the selector this widget is bind to.
     * @method element
     * @example
       var mypage = UI.page("pageid").element();
    */
    element: function () {
        return document.getElementById(this.id);
    }
};
