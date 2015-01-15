/*
 * Copyright (C) 2013 Adnane Belmadiaf <daker@ubuntu.com>
 * License granted by Canonical Limited
 *
 * This file is part of ubuntu-html5-ui-toolkit.
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
        <nav>
          <ul>
            <li>
              <a href="#" id="home">Home</a>
            </li>
          </ul>
        </nav>
      </footer>

      JavaScript access:
      var toolbar = UI.toolbar("toolbarID");
      UI.button('home').click(function () {
        UI.pagestack.push("main");
      });

 */

var Toolbar = (function () {

    function ToolbarListener(id) {
        this._id = id;
        this._onChangedCallbacks = [];
        this._listen();
    };

    ToolbarListener.prototype = {
        onchanged: function (callback) {
            if (callback && typeof callback === 'function')
                this._onChangedCallbacks.push(callback);
        },
        _listen: function () {
            var mutationObserverClass =
                this._getNativeMutationObserverClass();
            if (!mutationObserverClass) {
                console.error(
                    'Could not listen to toolbar changes: no mutation observer found');
                return;
            }
            var toolbar = document.getElementById(this._id);
            if (toolbar) {
                var observer = new mutationObserverClass(
                    this._onMutated.bind(this));
                observer.observe(toolbar, {
                    attributes: true
                });
            }
        },
        _onMutated: function (mutations, observer) {
            for (var i = 0; i < this._onChangedCallbacks.length; ++i) {
                this._onChangedCallbacks[i](mutations);
            }
        },
        _getNativeMutationObserverClass: function () {
            return window.MutationObserver || window.WebKitMutationObserver;
        },
    };


    function Toolbar(id, touchInfoDelegate) {

        this.PHASE_START = "start";
        this.PHASE_MOVE = "move";
        this.PHASE_END = "end";
        this.PHASE_CANCEL = "cancel";

        this.phase = null;

        this.toolbar = document.getElementById(id);
        if ( ! this.toolbar)
            throw "Invalid toolbar id";

        this._touchDown = false;
        this._touchInfoDelegate = touchInfoDelegate;

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

        var touchEvents = touchInfoDelegate.touchEvents;
        touchInfoDelegate.registerTouchEvent(
            touchEvents.touchStart, this.toolbar, this.__onTouchStart.bind(this));
        touchInfoDelegate.registerTouchEvent(
            touchEvents.touchEnd, this.toolbar, this.__onTouchEnd.bind(this));
        touchInfoDelegate.registerTouchEvent(
            touchEvents.touchMove, this.toolbar, this.__onTouchMove.bind(this));
        touchInfoDelegate.registerTouchEvent(
            touchEvents.touchLeave, this.toolbar, this.__onTouchLeave.bind(this));

        this._timer = null;

        var listener = new ToolbarListener(id);
        var self = this;
        listener.onchanged(function () {
            var toolbar = self.toolbar;

            function __isToolbarVisible() {
                return Array.prototype.slice.call(toolbar.classList)
                    .indexOf('revealed') >= 0;
            }
            if (__isToolbarVisible()) {
                self._timer = window.setTimeout(
                    function () {
                        self.hide();
                    },
                    5000);
            } else {
                if (self._timer) {
                    window.clearTimeout(self._timer);
                    self._timer = null;
                }
            }
        });
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
            this._touchDown = true;

            this.phase = this.PHASE_START;
            var identifier = evt.identifier !== undefined ? evt.identifier : 0;

            var touchEvent =
                this._touchInfoDelegate.translateTouchEvent(evt);

            this.fingerData[0].identifier = identifier;
            this.fingerData[0].start.x =
                this.fingerData[0].end.x = touchEvent.touches[0].pageX;
            this.fingerData[0].start.y =
                this.fingerData[0].end.y = touchEvent.touches[0].pageY;
        },

        /**
         * @private
         */
        __onTouchMove: function (evt) {
            if ( ! this._touchDown)
                return;

            if (this.phase === this.PHASE_END || this.phase === this.PHASE_CANCEL)
                return;

            if (this.phase == this.PHASE_START) {
                var touchEvent =
                    this._touchInfoDelegate.translateTouchEvent(evt);

                var identifier = evt.identifier !== undefined ? evt.identifier : 0;
                var f = this.__getFingerData(identifier);

                f.end.x = touchEvent.touches[0].pageX;
                f.end.y = touchEvent.touches[0].pageY;

		// Validate that the movement has a big enough amplitude
		// before considering it as a 'move'. The 0.4 is a value
		// that was setup after some experimentation on touch.
		var amplitude = this.__norm(f.start, f.end);
		if ((amplitude / this.toolbar.offsetHeight) < 0.4)
			return;

                evt.preventDefault();

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
            this._touchDown = false;
            phase = this.PHASE_END;
        },

        /**
         * @private
         */
        __onTouchLeave: function (e) {
            this._touchDown = false;
            phase = this.PHASE_CANCEL;
        },

        /**
         * @private
         */
        __norm: function (p1, p2) {
	    var vx = p2.x - p1.x;
	    var vy = p2.y - p1.y;
	    return Math.sqrt(vx * vx + vy * vy);
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
