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
 * A Toolbar is the JavaScript representation of an Ubuntu HTML5 app <em>footer</em>. 

######Contained List provides buttons
The Toolbar contains a List, where each list item is treated as a Button (see below). List items (Buttons) are pushed to the right. The default Back button always exists to the left and does not need to be declared. 

#####Default and custom footers
See the Pagestack class documentation for information about the default application-wide Footer, customizing it, and adding Page-specific Footers.
 * @class Toolbar
 * @constructor
 * @namespace UbuntuUI
 * @example
      <footer data-role="footer" class="revealed" id="footerID">
        <div data-role="list">
          <ul>
            <li>
              <a href="#" id="home">Home</a>
            </li>
          </ul>
        </div>
      </footer>

      JavaScript access:
      var toolbar = UI.footer("footerID");
      UI.button('home').click(function () {
        UI.pagestack.push("main");
      });

 */

var Toolbar = function (UbuntuUI, id) {
    this.toolbar = document.getElementById(id);
};

Toolbar.prototype = {
    /**-
     * Display a Toolbar
     * @method show
     */
    show: function () {
        this.toolbar.classList.add('revealed');
    },
    /**-
     * Hide a Toolbar
     * @method hide
     */
    hide: function () {
        this.toolbar.classList.remove('revealed');
    },
    /**
     * Toggle show/hide status of a Toolbar
     * @method toggle
     */
    toggle: function () {
        this.toolbar.classList.toggle('revealed');
    },
    /**
     * Provide a callback function that's called with the Toolbar is touched
     * @method touch
     * @param {Function} function - The function that is called when the Toolbar is touched
     */
    touch: function (callback) {
        this.toolbar.addEventListener(UbuntuUI.touchEvents.touchEnd, callback);
    },
    /**
     * Returns the DOM element associated with the id this widget is bind to.
     * @method element
     * @example
        var mytoolbar = UI.toolbar("toolbarid").element();
     */
    element: function () {
        return this.toolbar;
    }
};
