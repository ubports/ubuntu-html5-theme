/*
 * Copyright (C) 2013 Adnane Belmadiaf <daker@ubuntu.com>
 *
 * This file is part of ubuntu-html5-theme.
 *
 * This package is free software; you can redistribute it and/or modify
 * it under the terms of the Lesser GNU General Public License as
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

/* Tabs */
var Tabs = function (selector) {
    var tabs,
        pageX,
        pageY,
        isScrolling,
        deltaX,
        deltaY,
        offsetX,
        resistance,
        tabsWidth;

    if (selector === undefined)
        tabs = document.querySelector('[data-role=tabs]');
    else
        tabs = document.querySelector(selector);

    var getScroll = function () {
        var translate3d = tabs.style.webkitTransform.match(/translate3d\(([^,]*)/);
        return parseInt(translate3d ? translate3d[1] : 0)
    };

    var setTouchInProgress = function (val) {

        //Add or remove event listeners depending on touch status
        if (val === true) {
            tabs.addEventListener(UI.touchEvents.touchMove, onTouchMove);
            tabs.addEventListener(UI.touchEvents.touchEnd, onTouchEnd);

            // we only have leave events on desktop, we manually calcuate
            // leave on touch as its not supported in webkit
            if (UI.touchEvents.touchLeave) {
                tabs.addEventListener(UI.touchEvents.touchLeave, onTouchLeave);
            }
        } else {
            tabs.removeEventListener(UI.touchEvents.touchMove, onTouchMove, false);
            tabs.removeEventListener(UI.touchEvents.touchEnd, onTouchEnd, false);

            // we only have leave events on desktop, we manually calcuate
            // leave on touch as its not supported in webkit
            if (UI.touchEvents.touchLeave) {
                tabs.removeEventListener(UI.touchEvents.touchLeave, onTouchLeave, false);
            }
        }
    };

    var onTouchStart = function (e) {
        if (!tabs) return;

        isScrolling = undefined;
        tabsWidth = tabs.offsetWidth;
        resistance = 1;

        if (!UI.isTouch) {
            e.touches = [{
                pageX: e.pageX,
                pageY: e.pageY
            }];
        }
        pageX = e.touches[0].pageX;
        pageY = e.touches[0].pageY;

        tabs.style['-webkit-transition-duration'] = 0;
        setTouchInProgress(true);
    };

    var onTouchMove = function (e) {
        if (!UI.isTouch) {
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
        offsetX = (deltaX / resistance) + getScroll();

        tabs.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
    };

    var onTouchEnd = function (e) {
        if (!tabs || isScrolling) return;
        setTouchInProgress(false);
    };

    var onTouchLeave = function (e) {};

    var onClicked = function (e) {

        if ((this.className).indexOf('inactive') > -1) {
            var active_tab = document.querySelector('[data-role="tab"].active');
            offsetX = this.offsetLeft;
            tabs.style['-webkit-transition-duration'] = '.3s';
            tabs.style.webkitTransform = 'translate3d(-' + offsetX + 'px,0,0)';

            active_tab.classList.remove('inactive');
            active_tab.classList.remove('active');
            this.classList.remove('inactive');
            this.classList.add('active');

            [].forEach.call(document.querySelectorAll('[data-role="tab"]:not(.active)'), function (el) {
                el.classList.remove('inactive');
            });

            /*FIXME : We need to try to implement the infinite sliding
            Array.prototype.slice.call(
                    document.querySelectorAll('ul[data-role=tabs] li:nth-child(-n+3)')
                ).map(function(element) {
                    return element.cloneNode(true);
                }).forEach(function(element) {
                    element.classList.remove('active');
                    tabs.appendChild(element);
                });*/

        } else {
            [].forEach.call(document.querySelectorAll('[data-role="tab"]:not(.active)'), function (el) {
                el.classList.toggle('inactive');
            });
            window.setTimeout(function() {
                [].forEach.call(document.querySelectorAll('[data-role="tab"]:not(.active)'), function (el) {
                    el.classList.toggle('inactive');
                });
            }, 5000);
        }
    };

    tabs.addEventListener(UI.touchEvents.touchStart, onTouchStart);
    tabs.addEventListener(UI.touchEvents.touchMove, onTouchMove);
    tabs.addEventListener(UI.touchEvents.touchEnd, onTouchEnd);

    [].forEach.call(document.querySelectorAll('[data-role="tab"]'), function (el) {
        el.addEventListener('click', onClicked, false);
    });
};