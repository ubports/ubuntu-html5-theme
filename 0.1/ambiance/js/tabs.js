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

/* Tabs */

var Tabs = (function () {
    var pageX,
        pageY,
        isScrolling,
        deltaX,
        deltaY,
        offsetX,
        resistance,
        tabsWidth,
        activeTab,
        t1,
        t2,
        _UbuntuUI;


    function Tabs (UbuntuUI, tabs) {
        this._tabs = tabs;
        _UbuntuUI = UbuntuUI;

        //this._tabs.addEventListener(_UbuntuUI.touchEvents.touchStart, this.__onTouchStart.bind(this));
        //this._tabs.addEventListener(_UbuntuUI.touchEvents.touchMove, this.__onTouchMove.bind(this));
        //this._tabs.addEventListener(_UbuntuUI.touchEvents.touchEnd, this.__onTouchEnd.bind(this));

        t = this;
        [].forEach.call(document.querySelectorAll('[data-role="tab"]'), function (el) {
            [].forEach.call(el.childNodes, function (k) {
                    if (k.nodeName == "A") {
                        k.addEventListener('click', t.__onClicked.bind(t), false);
                    }
           });
        });
    }


    Tabs.prototype = {
        __getScroll: function () {
            var translate3d = this._tabs.style.webkitTransform.match(/translate3d\(([^,]*)/);
            return parseInt(translate3d ? translate3d[1] : 0)
        },

        __setTouchInProgress: function (val) {
            //Add or remove event listeners depending on touch status
            if (val === true) {
                this._tabs.addEventListener(_UbuntuUI.touchEvents.touchMove, this.__onTouchMove.bind(this));
                this._tabs.addEventListener(_UbuntuUI.touchEvents.touchEnd, this.__onTouchEnd.bind(this));

                // we only have leave events on desktop, we manually calcuate
                // leave on touch as its not supported in webkit
                if (_UbuntuUI.touchEvents.touchLeave) {
                    this._tabs.addEventListener(_UbuntuUI.touchEvents.touchLeave, this.__onTouchLeave.bind(this));
                }
            } else {
                this._tabs.removeEventListener(_UbuntuUI.touchEvents.touchMove, this.__onTouchMove.bind(this), false);
                this._tabs.removeEventListener(_UbuntuUI.touchEvents.touchEnd, this.__onTouchEnd.bind(this), false);

                // we only have leave events on desktop, we manually calcuate
                // leave on touch as its not supported in webkit
                if (_UbuntuUI.touchEvents.touchLeave) {
                    this._tabs.removeEventListener(_UbuntuUI.touchEvents.touchLeave, this.__onTouchLeave.bind(this), false);
                }
            }
        },

        __onTouchStart: function (e) {
            if (!this._tabs) return;
            window.clearTimeout(t1);
            window.clearTimeout(t2);
            isScrolling = undefined;
            tabsWidth = this._tabs.offsetWidth;
            resistance = 1;

            if (!_UbuntuUI.isTouch) {
                e.touches = [{
                    pageX: e.pageX,
                    pageY: e.pageY
                }];
            }
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;

            this._tabs.style['-webkit-transition-duration'] = 0;
            this.__setTouchInProgress(true);
        },

        __onTouchMove: function (e) {
            if (!_UbuntuUI.isTouch) {
                e.touches = [{
                    pageX: e.pageX,
                    pageY: e.pageY
                }];
            }
            deltaX = e.touches[0].pageX - pageX;
            deltaY = e.touches[0].pageY - pageY;
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;

            if (typeof isScrolling == 'undefined') {
                isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
            }
            if (isScrolling) return;
            offsetX = (deltaX / resistance) + this.__getScroll();

            this._tabs.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
        },

        __onTouchEnd: function (e) {
            if (!this._tabs || isScrolling) return;

            this.__setTouchInProgress(false);

            t = this;

            t1 = window.setTimeout(function () {
                activeTab = document.querySelector('[data-role="tab"].active');
                offsetX = activeTab.offsetLeft;
                t._tabs.style['-webkit-transition-duration'] = '.3s';
                t._tabs.style.webkitTransform = 'translate3d(-' + offsetX + 'px,0,0)';
                [].forEach.call(document.querySelectorAll('[data-role="tab"]:not(.active)'), function (el) {
                    el.classList.toggle('inactive');
                });
            }, 3000);
        },


        __onTouchLeave: function (e) {},

        __onClicked: function (e) {
            if ((this.parentNode.className).indexOf('inactive') > -1) {
                window.clearTimeout(t2);

                activeTab = document.querySelector('[data-role="tab"].active');
                offsetX = this.offsetLeft;
                this._tabs.style['-webkit-transition-duration'] = '.3s';
                this._tabs.style.webkitTransform = 'translate3d(-' + offsetX + 'px,0,0)';
                activeTab.classList.remove('inactive');
                activeTab.classList.remove('active');
                this.classList.remove('inactive');
                this.classList.add('active');

                [].forEach.call(document.querySelectorAll('[data-role="tab"]:not(.active)'), function (e) {
                    e.classList.remove('inactive');
                });

                /*Array.prototype.slice.call(
                    document.querySelectorAll('ul[data-role=tabs] li:nth-child(-n+3)')
                ).map(function (element) {
                    return element.cloneNode(true);
                }).forEach(function (element) {
                    element.classList.remove('active');
                    tabs.appendChild(element);
                });*/

                var id = e.getAttribute("data-page");
                this._evt = document.createEvent('Event');
                this._evt.initEvent('change',true,true);
                this._evt.page = id;
                this._tabs.dispatchEvent(this._evt);
            } else {

                [].forEach.call(document.querySelectorAll('[data-role="tab"]:not(.active)'), function (el) {
                    el.classList.toggle('inactive');
                });
                t2 = window.setTimeout(function () {
                    [].forEach.call(document.querySelectorAll('[data-role="tab"]:not(.active)'), function (el) {
                        el.classList.toggle('inactive');
                    });
                }, 3000);
            }
            e.preventDefault();
        },

        activate: function (id) {
            if (!id || typeof (id) !== 'string')
            return;
            activeTab = document.querySelector('[data-page="'+ id +'"]');

            [].forEach.call(document.querySelectorAll('[data-role="tab"]'), function (e) {
                e.classList.remove('active');
                e.classList.remove('inactive');
            });

            activeTab.classList.add('active');

            offsetX = activeTab.offsetLeft;
            this._tabs.style['-webkit-transition-duration'] = '.3s';
            this._tabs.style.webkitTransform = 'translate3d(-' + offsetX + 'px,0,0)';
        },

        onTabChanged : function(e, callback){
            this._tabs.addEventListener(e, callback);
        }
    };

    return Tabs;
})();
