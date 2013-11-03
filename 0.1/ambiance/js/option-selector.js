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
 * <http://www.gnu.org/licenses/>
 */

/* OptionSelector */
var OptionSelector = (function () {

    function __safeCall(f, args, errorfunc) {
        if (typeof (f) !== 'function')
            return;
        try {
            f.apply(null, args);
        } catch (e) {
            if (errorfunc && typeof (errorfunc) === 'function') errorfunc(e);
        }
    }

    function OptionSelector (id, expanded) {

        this.expanded = typeof expanded !== 'undefined' ? expanded : true;

        this.optionselector = document.getElementById(id);
        this.optionselector_ul = this.optionselector.querySelectorAll('ul')[0];
        this.optionselector_ul_li = this.optionselector.querySelectorAll('li');
        this.offsetX = -3.33;

        t = this;

        [].forEach.call(this.optionselector.querySelectorAll('li > a'), function (elm) {
            elm.addEventListener('click', t.__onClicked, false);
        });

        if (this.expanded) {
            t.__open();
        }
    }

    OptionSelector.prototype = {

        __onClicked: function () {


            index = 0;
            menuNodes = this.parentNode.parentNode.childNodes;

            for(var i = 0, max = menuNodes.length; i < max; i++) {
                if (menuNodes[i]==this.parentNode) break;
                if (menuNodes[i].nodeType==1) { console.log(this.parentNode);index++; }
            }

            if (t.expanded) {
                t.__close(index);
                this.classList.add('active');
                this.classList.add('closed');
                this.style.borderTop = '0';
            }
            else {
                this.classList.remove('closed');
                t.__open();
                this.style.borderTop = '1px solid #C7C7C7';
            }

            e.preventDefault();
        },

        __open: function () {
            this.optionselector_ul.style['-webkit-transition-duration'] = '.3s';
            this.optionselector_ul.style.webkitTransform = 'translate3d(0, 0rem,0)';
            this.optionselector.style.height = 3.3*this.optionselector_ul_li.length + 'rem';
            this.expanded = true;
        },

        __close: function (index) {

            this.optionselector_ul.style['-webkit-transition-duration'] = '.3s';
            this.optionselector_ul.style.webkitTransform = 'translate3d(0,' + this.offsetX*index + 'rem,0)';

            this.optionselector.style.height = '3.3rem';

            [].forEach.call(this.optionselector.querySelectorAll('li > a'), function (el) {
                el.classList.remove('active');
            });
            this.expanded = false;
        },
    };
    return OptionSelector;
})();
