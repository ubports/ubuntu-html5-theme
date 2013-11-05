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
 * @module UbuntuUI
 */

/**
 * UbuntuUI is the critical Ubuntu HTML5 framework class. You need to construct an UbuntuUI object and initialize it to have an Ubuntu HTML5 app. You then use this object to access Ubuntu HTML5 objects (and object methods) that correspond to the Ubuntu HTML5 DOM elements.

Note: The UbuntuUI object is "UI" in all API doc examples.
 * @class UbuntuUI
 * @constructor
 * @example
      var UI = new UbuntuUI();
      window.onload = function () {
        UI.init();
        UI.pagestack.push('pageid');
        [...]
      };
 */
var UbuntuUI = (function () {

    PAGESTACK_BACK_ID = 'ubuntu-pagestack-back';

    function __hasPageStack(document) {
        return document.querySelectorAll("[data-role='pagestack']") != null;
    };

    function __hasTabs(document) {
         return document.querySelectorAll("[data-role='tabs']") != null;
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
            if (self._pageStack.depth() > 1){
                self._pageStack.pop();
                self._tabs.activate(self._pageStack.currentPage());
            }
            e.preventDefault();
        };
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

            // FIXME: support multiple page stack & complex docs?
            var pagestacks = d.querySelectorAll("[data-role='pagestack']");
            if (pagestacks.length == 0)
                return;
            var pagestack = pagestacks[0];

            this._pageStack = new Pagestack(pagestack);

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

            _tabs_temp = this._tabs;
            this._pageStack.onPageChanged(function (e) {
                _tabs_temp.activate(e.page);
            });

            _pagestack_temp = this._pageStack;
            this._tabs.onTabChanged(function (e) {
                _pagestack_temp.push(e.page);
            });
        },

        __setupPage: function (document) {
            if (__hasPageStack(document)) {
                this.__setupPageStack(document);
            }
        },

        __setupTabs: function (document) {
             if (__hasTabs(document)) {
                if (typeof Tabs != 'undefined' && Tabs) {
                    multi_tabs = document.querySelectorAll('[data-role=tabs]');
                    if (multi_tabs.length == 0)
                        return;
                    var tabs_o = multi_tabs[0];
                    this._tabs = new Tabs(this, tabs_o);
                }
             }
        },

        /**
         * Required call that initializes the UbuntuUI object
         * @method {} init
         */
        init: function () {
            this.__setupTabs(document);
            this.__setupPage(document);
        },

        /**
         * Gets an Ubuntu Page object
         * @method page
         * @param {ID} id - The element's id attrubute
         * @return {Page} - The Page with the specified id
         */
        page: function (id) {
            if (typeof Page != 'undefined' && Page ) {
                return new Page(id);
            }
        },

        /**
         * Gets an Ubuntu Shape object
         * @method shape
         * @param {ID} id - The element's id attrubute
         * @return {Shape} - The Shape with the specified id
         */
        shape: function (id) {
            if (typeof Shape != 'undefined' && Shape ) {
                return new Shape(id);
            }
        },

        /**
         * Gets an Ubuntu Button object
         * @method button
         * @param {ID} id - The element's id attrubute
         * @return {Button} - The Button with the specified id
         */
        button: function (id) {
            if (typeof Button != 'undefined' && Button) {
                return new Button(id);
            }
        },

        /**
         * Gets an Ubuntu Dialog object
         * @method dialog
         * @param {ID} id - The element's id attrubute
         * @return {Dialog} - The Dialog with the specified id
         */
        dialog: function (id) {
            if (typeof Dialog != 'undefined' && Dialog) {
                return new Dialog(id);
            }
        },

        /**
         * Gets an Ubuntu Popover object
         * @method popover
         * @param {Element} el - The element to which the Popover's position is relative
         * @param {ID} id - The element's id attrubute
         * @return {Popover} - The Popover with the specified id
         */
        popover: function (elem, id) {
            if (typeof Popover != 'undefined' && Popover) {
                return new Popover(elem, id);
            }
        },

        /**
         * Gets an Ubuntu Header object
         * @method header
         * @param {ID} id - The element's id attrubute
         * @return {Header} - The Header with the specified id
         */
        header: function (id) {
            if (typeof Header != 'undefined' && Header) {
                return new Header(id);
            }
        },

        /**
         * Gets an Ubuntu Toolbar object
         * @method toolbar
         * @param {ID} id - The element's id attrubute
         * @return {Toolbar} - The Toolbar with the specified id
         */
        toolbar: function (id) {
            if (typeof Toolbar != 'undefined' && Toolbar) {
                return new Toolbar(this, id);
            }
        },

        /**
         * Gets an Ubuntu List
         * @method list
         * @param {Selector} selector - A selector that JavaScript querySelector method understands
         * @return {List}
         */
        list: function (selector) {
            if (typeof List != 'undefined' && List) {
                return new List(selector);
            }
        },

        /**
         * Gets the HTML element associated with an Ubuntu HTML5 JavaScript object
         * @method getEl
         * @param {UbuntuObject} object - An UbuntuUI widget object
         * @return {Element} - The HTML element
         */
        getEl: function(widget) {
          return document.getElementById(widget.id);
        },

        /**
         * Gets this UbuntuUI's single Pagestack object
         * @method pagestack
         * @return {Pagestack} - The Pagestack
         */
        get pagestack() {
            return this._pageStack;
        },

        /**
         * Gets this UbuntuUI's single Tabs object
         * @method tabs
         * @return {Tabs} - The Tabs
         */
        get tabs() {
            return this._tabs;
        },

    };

    return UbuntuUI;

})();
