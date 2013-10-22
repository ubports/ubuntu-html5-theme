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
 * An Ubuntu Header
 * @class Header
 * @constructor
 * @example
      Declare a header in HTML as a direct child of the &lt;body&gt; like this:
      <body>
        <header data-role="header">
          <nav data-role="navbar" class="tabs" >
            <div class="tabs-inner">
              <ul data-role="tabs">
                <li class="active" data-role="tab" id="tab1">
                  <a id='hometab'>TEXT</a>
                </li>
                <li class="inactive" data-role="tab" id="tab2">
                  <a id='anothertab'>TEXT</a>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        ...
      </body>
 */
var Header= function (id) {
    this.id =  id;
};

Header.prototype = {
    /**
     * Placeholder for future methods
     */
};
