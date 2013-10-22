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
 * An Ubuntu Shape
 * @class Shape
 * @constructor
 * @example
      Declare in HTML like this:
      <div data-role="shape">
        <img src="URI"/>
      </div>
 */
var Shape = function (id) {
    this.id =  id;
};

Shape.prototype = {
    /**
     * Associate a function with the Click event
     * @method click
     * @param {Function} - The function to execute on click
     * @example
        UI.shape("id").click(function(){
         console.log("Clicked");
        });
     */
    click: function (callback) {
      if ( ! document.getElementById(this.id)) {
        throw "Error. id attribute: " + String(this.id) + " is not present in DOM";
      } else {
        var el = document.getElementById(this.id);
        el.addEventListener('click', callback);
      }
    },
};
