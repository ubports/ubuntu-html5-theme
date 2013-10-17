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

/**
 * UbuntuUI is the critical object you need to contruct and initialize for an Ubuntu HTML5 GUI. You then use its properties and methdos to access the Ubuntu HTML5 DOM elements and their methods.
 * @class UbuntuUI
 * @constructor
 * @example
     window.onload = function () {
     var UI = new UbuntuUI();
     UI.init();
     // Then access UI's properties and methods 
     UI.pagestack.push("pageid");
 */
var UbuntuUI = (function () {

    PAGESTACK_BACK_ID = 'ubuntu-pagestack-back';

    function __hasPageStack(document) {
        return document.querySelectorAll("[data-role='pagestack']") != null;
    };

    function __createBackButtonListItem(d) {
        var a = d.createElement('a');
        a.setAttribute('href', '#');
        a.setAttribute('data-role', 'back');

        a.setAttribute('id', PAGESTACK_BACK_ID + '-' + Math.random());

        var img = d.createElement('img');
        img.setAttribute('src', '/usr/share/ubuntu-html5-theme/0.1/ambiance/img/back@18.png');

        // TODO: translation?
        img.setAttribute('alt', 'Back');
        a.appendChild(img);
        var span = d.createElement('span');
        var text = d.createTextNode('Back');
        span.appendChild(text);
        a.appendChild(span);

        var li = d.createElement('li');
        li.appendChild(a);

        return li;
    };

    function __appendBackButtonToFooter(self, d, footer) {
        var li = __createBackButtonListItem(d);
        var ul = null;
        if (footer.querySelectorAll('ul').length == 0) {
            ul = d.createElement('ul');
        } else {
            ul = footer.querySelectorAll('ul')[0];
        }
        ul.appendChild(li);

        if (footer.querySelectorAll('nav').length == 0) {
            var nav = d.createElement('nav');
            nav.appendChild(ul);
            footer.appendChild(nav);
        }

        var a = li.querySelector('a');
        a.onclick = function (e) {
            if (self._pageStack.depth() > 1)
                self._pageStack.pop();
            e.preventDefault();
        }.bind(self);
    }

    function UbuntuUI() {
        var U = this;
        U.isTouch = "ontouchstart" in window;
        U.touchEvents = {
            touchStart: U.isTouch ? 'touchstart' : 'mousedown',
            touchMove: U.isTouch ? 'touchmove' : 'mousemove',
            touchEnd: U.isTouch ? 'touchend' : 'mouseup',
            touchLeave: U.isTouch ? null : 'mouseleave' //we manually detect leave on touch devices, so null event here
        };
    };

    UbuntuUI.prototype = {
        __setupPageStack: function (d) {
            // TODO validate no more than one page stack etc.
            // d.querySelectorAll("[data-role='pagestack']")

            this._pageStack = new Pagestack();

            // FIXME: support multiple page stack & complex docs?
            var pagestacks = d.querySelectorAll("[data-role='pagestack']");
            if (pagestacks.length == 0)
                return;
            var pagestack = pagestacks[0];
            var immediateFooters = [].filter.call(pagestack.children,
                function (e) {
                    return e.nodeName.toLowerCase() === 'footer';
                });
            if (immediateFooters.length !== 0) {
                // There is a main footer for the whole pagestack,
                // FIXME: only consider the first (there should be only 1 anyway)
                var footer = immediateFooters[0];

                __appendBackButtonToFooter(this, d, footer);

                return;
            }

            // try to find subpages & append back button there
            var pages = pagestack.querySelectorAll("[data-role='page']");
            for (var idx = 0; idx < pages.length; ++idx) {
                var page = pages[idx];

                // TODO: only add the footer for now, but need to sync w/ title
                //  , properties & header
                var footer;
                if (page.querySelectorAll("[data-role='footer']").length == 0) {
                    footer = d.createElement('footer');
                    footer.setAttribute('data-role', 'footer');
                    footer.setAttribute('class', 'revealed');

                    page.appendChild(footer);
                } else {
                    // TODO: validate footer count: should be 1 footer
                    footer = page.querySelectorAll("[data-role='footer']")[0];
                }

                __appendBackButtonToFooter(this, d, footer);
            }
        },

        __setupPage: function (document) {
            if (__hasPageStack(document)) {
                this.__setupPageStack(document);
            }
        },

        /**
         * Required call to initialize the UbuntuUI object
         * @method {} init
         */
        init: function () {
            this.__setupPage(document);
        },

        /**
         * Getrs an Ubuntu Button element
         * @method button
         * @param {ID} - the button's id attrubute
         * @return {Button} - The button with the specifed id
         */
        button: function (id) {
            if (typeof Button != 'undefined' && Button) {
                return new Button(id);
            }
        },

        /**
         * Gets an Ubuntu Dialog element
         * @method dialog
         * @param {ID} - The dialog's id attrubute
         * @return {Dialog} - The dialog with the specified id
         */
        dialog: function (id) {
            if (typeof Dialog != 'undefined' && Dialog) {
                return new Dialog(id);
            }
        },

        /**
         * Gets an Ubuntu Popover
         * @method popover
         * @param {elem} - the element to which the popover is attached
         * @param {ID} - The created popover's id attrubute
         * @return {Popover} - The created popover
         */
        popover: function (elem, id) {
            if (typeof Popover != 'undefined' && Popover) {
                return new Popover(elem, id);
            }
        },

        /**
         * Gets an Ubuntu Tabs object
         * @method tabs
         * @param {[CssSelectpr]} - The CSS selector of the desired Tabs element. If omitted, the app's single tabs oobject is used
         * @return {Tabs} - The app's single Tabs object
         */
        tabs: function (selector) {
            if (typeof Tabs != 'undefined' && Tabs) {
                if (selector === undefined)
                    tabs = document.querySelector('[data-role=tabs]');
                else
                    tabs = document.querySelector(selector);
                return new Tabs(this, tabs);
            }
        },

        /**
         * Gets an Ubuntu Toolbar
         * @method toolbar
         * @param {ID} - The toolbar's id attrubute
         * @return {Toolbar} - The 
         */
        toolbar: function (id) {
            if (typeof Toolbar != 'undefined' && Toolbar) {
                return new Toolbar(this, id);
            }
        },

        /**
         * Gets an Ubuntu List
         * @method list
         * @param {ID} - the toolbar's id attrubute
         * @return {List}
         */
        list: function (selector) {
            if (typeof List != 'undefined' && List) {
                return new List(selector);
            }
        },

        /**
         * Gets the Ubuntu Pagestack
         * @method list
         * @return {Pagestack}
         */
        get pagestack() {
            return this._pageStack;
        }
    };

    return UbuntuUI;

})();
