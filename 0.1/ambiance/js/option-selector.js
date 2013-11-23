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

    var currentlyExpanded = false,
        currentIndex = 0,
        values = "";

    function OptionSelector (id, expanded, multiSelection) {

        this.expanded = typeof expanded !== 'undefined' ? expanded : true;
        this.multiSelection = typeof multiSelection !== 'undefined' ? multiSelection : true;

        this.optionselector = document.getElementById(id);
        this.optionselector_ul = this.optionselector.querySelectorAll('ul')[0];
        this.optionselector_ul_li = this.optionselector.querySelectorAll('li');

        t = this;

        [].forEach.call(this.optionselector_ul_li, function (elm) {
            elm.addEventListener('click', t.__onClicked, false);
        });

        if (t.expanded) {
            t.__open();
        }
        else {
            if (currentlyExpanded) {
                t.__open();
                this.optionselector_ul_li[0].classList.add('active');
            } else {
                t.__close(currentIndex);
                this.optionselector_ul_li[0].classList.add('closed');
            }
        }
    }

    OptionSelector.prototype = {

        __onClicked: function (e) {
            values = "";
            currentIndex = 0;

            if (t.expanded) {
                if (!t.multiSelection) {
                    [].forEach.call(t.optionselector_ul_li, function (elm) {
                        elm.classList.remove('active');
                    });
                    this.classList.toggle('active');
                }
                else {
                    this.classList.toggle('active');
                }
            }
            else {

                for(i = 0, max = t.optionselector_ul_li.length; i < max; i++) {
                    if (t.optionselector_ul_li[i]==this) break;
                    if (t.optionselector_ul_li[i].nodeType==1) { currentIndex++; }
                }

                if (currentlyExpanded) {
                    t.__close(currentIndex);
                    this.classList.add('active');
                    this.classList.add('closed');
                    this.style.borderTop = '0';
                }
                else {
                    this.classList.add('active');
                    this.classList.remove('closed');
                    t.__open();
                    this.style.borderTop = '1px solid #C7C7C7';
                }
            }

            k = 0;
            for(i = 0, max = t.optionselector_ul_li.length; i < max; i++) {
                if (t.optionselector_ul_li[i].nodeType==1) {
                    if ((t.optionselector_ul_li[i].className).indexOf('active') > -1) {
                        if (k == 0) {
                            values = t.optionselector_ul_li[i].getAttribute("data-value");
                        }
                        else {
                            values = values + ", " + t.optionselector_ul_li[i].getAttribute("data-value");
                        }
                        k++;
                    }
                }
            }

            this._evt = document.createEvent('Event');
            this._evt.initEvent('onclicked', true, true);
            this._evt.values = values;
            this.dispatchEvent(this._evt);

            e.preventDefault();
        },

        __open: function () {
            this.optionselector_ul.style['-webkit-transition-duration'] = '.4s';
            this.optionselector_ul.style.webkitTransform = 'translate3d(0, 0rem,0)';
            this.optionselector.style.height = 3*this.optionselector_ul_li.length + 'rem';
            currentlyExpanded = true;
        },

        __close: function (currentIndex) {
            this.optionselector_ul.style['-webkit-transition-duration'] = '.4s';
            this.optionselector_ul.style.webkitTransform = 'translate3d(0,' + -3*currentIndex + 'rem,0)';
            this.optionselector.style.height = '3rem';
            [].forEach.call(this.optionselector_ul_li, function (elm) {
                elm.classList.remove('active');
            });
            currentlyExpanded = false;
        },

        onClicked : function(callback){
            this.optionselector_ul.addEventListener("onclicked", callback);
        }
    };
    return OptionSelector;
})();
