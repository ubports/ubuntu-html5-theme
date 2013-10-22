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
 * An Ubuntu Toolbar is the same thing as the Footer. The Toolbar/Footer contains a Ubuntu list (see below). See the Pagestack documentation for information about the default footer, defining an application footer, and Page specific footers. 
 * @class Toolbar
 * @constructor
 * @example
     Declare an Ubuntu  in HTML like this:
     <footer data-role="footer" class="revealed" id="footer">
       <section data-role="list">
         <navbar>
           <ul>
             <li>
                 <a href="#" id="home">Home</a>
             </li>
           </ul>
         </navbar>
       </section>
     </footer>

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
     * @param {Function} - The function that is called when the Toolbar is touched
     */
    touch: function (callback) {
        this.toolbar.addEventListener(UbuntuUI.touchEvents.touchEnd, callback);
    }
};
