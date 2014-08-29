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
 * An ActionBar is the JavaScript representation of an Ubuntu HTML5 app <em>ActionBar</em>.
 */

var ActionBar = (function () {

    function ActionBar(tabs, oldFooter, parent) {
        this._tabs = tabs;
        this._oldFooter = oldFooter;
        this._oldFooterParent = parent;

        this._overlay = document.querySelector('[data-role="overlay"]');

        var newActionsBar = document.querySelector('[data-role="actions"]');

        if (!this._oldFooter)
            return;

        var actionBar = this._oldFooter,
            actions = actionBar.querySelector('ul'),
            actionButtons = actionBar.querySelectorAll('ul li'),
            i = actionButtons.length;
        newActionsBarWrapper = document.createElement('div');
        newActionsBarWrapper.setAttribute("data-role", "actions-wrapper");
        newActionsBarWrapper.setAttribute("id", "actions_" + this._oldFooterParent.id);

        if (actionButtons.length > 2) {
            // Maintain the first then replace the rest with an action overflow
            var firstAction = actionButtons[0],
                overflowList = document.createElement('ul'),
                /* Actions Button */
                firstButton = document.createElement('button'),
                overflowButton = document.createElement('button'),
                /* Icon */
                firstIcon = firstAction.querySelector('img').getAttribute('src'),
                /* ID*/
                firstId = firstAction.querySelector('a').getAttribute('id');

            var k =1;

            if (this._tabs._tabsitems.length == 1) {
                k = 2;
                this._tabs._tabtitle.style.width = "calc(100% - 155px)";

                // Maintain the second
                var secondAction = actionButtons[1],
                /* Actions Button */
                secondButton = document.createElement('button'),
                /* Icon */
                secondIcon = secondAction.querySelector('img').getAttribute('src'),
                /* ID*/
                secondId = secondAction.querySelector('a').getAttribute('id');
            }

            overflowList.setAttribute('data-role', 'actions-overflow-list');

            // Hide the overflow
            for (var x = k; x < i; x++) {
                var li = document.createElement('li'),
                    a_id = actionButtons[x].querySelector('a').getAttribute('id'),
                    lbl = actionButtons[x].querySelector('span').innerHTML,
                    icon = actionButtons[x].querySelector('img').getAttribute('src');

                li.innerHTML = lbl;
                li.setAttribute('id', a_id);

                li.style.backgroundImage = 'url( ' + icon + ' )';
                overflowList.appendChild(li);

                li.onclick = function (e) {
                    overflowList.classList.toggle('opened');
                    self._overlay.classList.toggle('active');
                    e.preventDefault();
                };
            }

            // Add the action overflow button
            overflowButton.setAttribute('data-role', 'actions-overflow-icon');

            //firstButton.style.backgroundImage = 'url( ' + firstIcon + ' )';
            firstButton.setAttribute('id', firstId);
            document.styleSheets[0].addRule('#'+ firstId + ':after','background-image: url("' + firstIcon + '");');

            newActionsBarWrapper.appendChild(firstButton);
            if (this._tabs._tabsitems.length == 1) {
                secondButton.setAttribute('id', secondId);
                document.styleSheets[0].addRule('#'+ secondId + ':after','background-image: url("' + secondIcon + '");');
                newActionsBarWrapper.appendChild(secondButton);
            }
            newActionsBarWrapper.appendChild(overflowButton);
            newActionsBarWrapper.appendChild(overflowList);

            self = this;
            overflowButton.onclick = function (e) {
                overflowList.classList.toggle('opened');
                self._overlay.classList.toggle('active');
                e.preventDefault();
            };
        } else {

            for (var y = 0; y < i; y++) {
                var actionButton = document.createElement('button'),
                    lbl = actionButtons[y].querySelector('span').innerHTML,
                    icon = actionButtons[y].querySelector('img').getAttribute('src'),
                    a_id = actionButtons[y].querySelector('a').getAttribute('id');

                actionButton.style.backgroundImage = 'url( ' + icon + ' )';
                actionButton.setAttribute('content', icon);
                actionButton.setAttribute('id', a_id);

                newActionsBarWrapper.appendChild(actionButton);
            }
        }

        newActionsBar.appendChild(newActionsBarWrapper);
    };

    ActionBar.prototype = {
        /**
         * Returns the DOM element associated with the id this widget is bind to.
         * @method element
         * @example
            var myactionbar = UI.actionbar("actionbarid").element();
         */
        element: function () {
            return this.actionbar;
        }
    };
    return ActionBar;
})();
