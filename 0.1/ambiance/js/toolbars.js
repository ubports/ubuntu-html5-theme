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

var Toolbar = (function () {

    function Toolbar(id, touchInfoDelegate) {

        this.PHASE_START = "start";
        this.PHASE_MOVE = "move";
        this.PHASE_END = "end";
        this.PHASE_CANCEL = "cancel";

        this.phase = null;

        this.UI = UI;

        this.toolbar = document.getElementById(id);

        this._touchInfoDelegate = touchInfoDelegate;

        var touchEvents = touchInfoDelegate.touchEvents;

        this.fingerData = [];
        this.fingerData.push({
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            },
            identifier: 0
        });

        this.toolbar.addEventListener(touchEvents.touchStart, this.__onTouchStart.bind(this));
        this.toolbar.addEventListener(touchEvents.touchMove, this.__onTouchMove.bind(this));
        this.toolbar.addEventListener(touchEvents.touchEnd, this.__onTouchEnd.bind(this));
        this.toolbar.addEventListener(touchEvents.touchLeave, this.__onTouchLeave.bind(this));
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
            this.toolbar.addEventListener(this.touchEvents.touchEnd, callback);
        },

        /**
         * Returns the DOM element associated with the id this widget is bind to.
         * @method element
         * @example
            var mytoolbar = UI.toolbar("toolbarid").element();
         */
        element: function () {
            return this.toolbar;
        },

        /**
         * @private
         */
        __onTouchStart: function (evt) {

            this.phase = this.PHASE_START;
            var identifier = evt.identifier !== undefined ? evt.identifier : 0;

            if (!this.UI.isTouch) {
                evt.touches = [{
                    pageX: evt.pageX,
                    pageY: evt.pageY
                }];
            }

            this.fingerData[0].identifier = identifier;
            this.fingerData[0].start.x = this.fingerData[0].end.x = evt.touches[0].pageX;
            this.fingerData[0].start.y = this.fingerData[0].end.y = evt.touches[0].pageY;
        },

        /**
         * @private
         */
        __onTouchMove: function (evt) {

            if (this.phase === this.PHASE_END || this.phase === this.PHASE_CANCEL)
                return;

            if (this.phase == this.PHASE_START) {
                if (!this.UI.isTouch) {
                    evt.touches = [{
                        pageX: evt.pageX,
                        pageY: evt.pageY
                    }];
                }

                var identifier = evt.identifier !== undefined ? evt.identifier : 0;
                var f = this.__getFingerData(identifier);

                f.end.x = evt.touches[0].pageX;
                f.end.y = evt.touches[0].pageY;

                direction = this.__calculateDirection(f.start, f.end);

                if (direction == "DOWN") {
                    this.hide();
                }

                if (direction == "UP") {
                    this.show();
                }

                phase = this.PHASE_MOVE;
            }
        },

        /**
         * @private
         */
        __onTouchEnd: function (e) {
            phase = this.PHASE_END;
        },

        /**
         * @private
         */
        __onTouchLeave: function (e) {
            phase = this.PHASE_CANCEL;
        },

        /**
         * @private
         */
        __calculateDirection: function (startPoint, endPoint) {
            var angle = this.__calculateAngle(startPoint, endPoint);

            if ((angle <= 45) && (angle >= 0)) {
                return "LEFT";
            } else if ((angle <= 360) && (angle >= 315)) {
                return "LEFT";
            } else if ((angle >= 135) && (angle <= 225)) {
                return "RIGHT";
            } else if ((angle > 45) && (angle < 135)) {
                return "DOWN";
            } else {
                return "UP";
            }
        },

        /**
         * @private
         */
        __getFingerData: function (id) {
            for (var i = 0; i < this.fingerData.length; i++) {
                if (this.fingerData[i].identifier == id) {
                    return this.fingerData[i];
                }
            }
        },

        /**
         * @private
         */
        __calculateAngle: function (startPoint, endPoint) {
            var x = startPoint.x - endPoint.x;
            var y = endPoint.y - startPoint.y;
            var r = Math.atan2(y, x); //radians
            var angle = Math.round(r * 180 / Math.PI); //degrees

            //ensure value is positive
            if (angle < 0) {
                angle = 360 - Math.abs(angle);
            }

            return angle;
        }
    };
    return Toolbar;
})();
