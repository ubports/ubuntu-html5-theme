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
 * @class Tabs
 * @constructor
 * @example
      <header data-role="header">
        <nav class="tabs" data-role="navbar">
          <div class="tabs-inner">
            <ul data-role="tabs">
              <li class="active" data-role="tab">
                <a href="#item1" id="firstTab">First</a>
              </li>
              <li class="inactive" data-role="tab">
                <a href="#item2" id="secondTab">Second</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
*/
var Tabs = function (UbuntuUI, tabs) {
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
        t2;

    var getScroll = function () {
        var translate3d = tabs.style.webkitTransform.match(/translate3d\(([^,]*)/);
        return parseInt(translate3d ? translate3d[1] : 0)
    };

    var setTouchInProgress = function (val) {

        //Add or remove event listeners depending on touch status
        if (val === true) {
            tabs.addEventListener(UbuntuUI.touchEvents.touchMove, onTouchMove);
            tabs.addEventListener(UbuntuUI.touchEvents.touchEnd, onTouchEnd);

            // we only have leave events on desktop, we manually calcuate
            // leave on touch as its not supported in webkit
            if (UbuntuUI.touchEvents.touchLeave) {
                tabs.addEventListener(UbuntuUI.touchEvents.touchLeave, onTouchLeave);
            }
        } else {
            tabs.removeEventListener(UbuntuUI.touchEvents.touchMove, onTouchMove, false);
            tabs.removeEventListener(UbuntuUI.touchEvents.touchEnd, onTouchEnd, false);

            // we only have leave events on desktop, we manually calcuate
            // leave on touch as its not supported in webkit
            if (UbuntuUI.touchEvents.touchLeave) {
                tabs.removeEventListener(UbuntuUI.touchEvents.touchLeave, onTouchLeave, false);
            }
        }
    };

    var onTouchStart = function (e) {
        if (!tabs) return;
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        isScrolling = undefined;
        tabsWidth = tabs.offsetWidth;
        resistance = 1;

        if (!UbuntuUI.isTouch) {
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
        if (!UbuntuUI.isTouch) {
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

        activeTab = document.querySelector('[data-role="tab"].active');
        t1 = window.setTimeout(function() {
                offsetX = activeTab.offsetLeft;
                tabs.style['-webkit-transition-duration'] = '.3s';
                tabs.style.webkitTransform = 'translate3d(-' + offsetX + 'px,0,0)';
                [].forEach.call(document.querySelectorAll('[data-role="tab"]:not(.active)'), function (el) {
                    el.classList.toggle('inactive');
                });
        }, 5000);
    };

    var onTouchLeave = function (e) {};

    var onClicked = function (e) {

        if ((this.className).indexOf('inactive') > -1) {
            window.clearTimeout(t2);
            activeTab = document.querySelector('[data-role="tab"].active');
            offsetX = this.offsetLeft;
            tabs.style['-webkit-transition-duration'] = '.3s';
            tabs.style.webkitTransform = 'translate3d(-' + offsetX + 'px,0,0)';
            activeTab.classList.remove('inactive');
            activeTab.classList.remove('active');
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
            t2 = window.setTimeout(function() {
                [].forEach.call(document.querySelectorAll('[data-role="tab"]:not(.active)'), function (el) {
                    el.classList.toggle('inactive');
                });
            }, 5000);
        }
        e.preventDefault();
    };

    tabs.addEventListener(UbuntuUI.touchEvents.touchStart, onTouchStart);
    tabs.addEventListener(UbuntuUI.touchEvents.touchMove, onTouchMove);
    tabs.addEventListener(UbuntuUI.touchEvents.touchEnd, onTouchEnd);

    [].forEach.call(document.querySelectorAll('[data-role="tab"]'), function (el) {
        el.addEventListener('click', onClicked, false);
    });
};
