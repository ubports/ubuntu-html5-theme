/*
 * Copyright (C) 2014 Canonical Ltd
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
 * One of the navigation pattern that can be used within an Ubuntu App is the flat navigation. Tabs are the standard way to provide such a navigation pattern from within your application.

A Tab represents the UI element that hosts your tab content. This UI element is being activated by the user selecting it as part of the Header element.

 * @class Tab
 * @constructor
 * @namespace UbuntuUI
 * @example
      </body>

        <div data-role="mainview">
          <header data-role="header" id="headerID">
            <ul data-role="tabs">
              <li data-role="tabitem" data-page="main">
                Main
              </li>
              <li data-role="tabitem" data-page="page2">
                Two
              </li>
            </ul>
          </header>

          <div data-role="content">
              <div data-role="tab" id="main">
                [...]
              </div>
              <div data-role="tab" id="page2">
                [...]
              </div>
          </div>

        </div>
      </body>

      JavaScript access:
      var tab = UI.tab("tabID");
 */
var Tab = function (id) {
    this.id = id;
};

Tab.prototype = {
    /**
     * Returns the DOM element associated with the selector this widget is bind to.
     * @method element
     * @return {DOMElement}
     * @example
       var mytab = UI.tab("tabid").element();
    */
    element: function () {
        return document.getElementById(this.id);
    },

    /**
     * Deactivates the current tab.
     * @method {} deactivate
     */
    deactivate: function () {
        this.__updateVisibleState('none', function (footer) {
            if (!footer)
                return;
            footer.style.display = 'none';
            footer.classList.remove('revealed');
        });
    },

    /**
     * Activates the current tab.
     * @method {} activate
     */
    activate: function (id) {
        this.__hideVisibleSibling();
        this.__updateVisibleState('block', function (footer) {

            var newActionsBar = document.querySelector('[data-role="actions"]');

            // Reset the actionbar
            newActionsBar.innerHTML = "";


            if (!footer)
                return;

            var actionBar = footer;
                actions = actionBar.querySelector('ul'),
                actionButtons = actionBar.querySelectorAll('ul li'),
                i = actionButtons.length;

            if (actionButtons.length > 3) {

                // Maintain the first & second item then replace the rest with an action overflow
                var firstAction = actionButtons[0],
                    secondAction = actionButtons[1],
                    actionsPopover = document.createElement('div'),
                    overflowList = document.createElement('ul'),
                    /* Actions Buttons */
                    firstButton = document.createElement('button'),
                    secondButton = document.createElement('button'),
                    overflowButton = document.createElement('button'),
                    /* Icons */
                    firstIcon = firstAction.querySelector('img').getAttribute('src'),
                    secondIcon = secondAction.querySelector('img').getAttribute('src');


                actionsPopover.setAttribute('data-role', 'popover');
                actionsPopover.setAttribute('data-gravity', 'n');
                actionsPopover.classList.add('has_actions');

                overflowList.setAttribute('data-role', 'action-overflow-list');

                // Hide the overflow
                for (var x = 2; x < i; x++) {
                    var li = document.createElement('li'),
                        lbl = actionButtons[x].querySelector('span').innerHTML,
                        icon = actionButtons[x].querySelector('img').getAttribute('src');

                    li.innerHTML = lbl;

                    li.style.backgroundImage = 'url( ' + icon + ' )';
                    overflowList.appendChild(li);
                }

                // Add the action overflow button
                overflowButton.setAttribute('data-role', 'action-overflow-icon');

                actionsPopover.appendChild(overflowList);

                firstButton.style.backgroundImage = 'url( ' + firstIcon + ' )';
                secondButton.style.backgroundImage = 'url( ' + secondIcon + ' )';

                newActionsBar.appendChild(firstButton);
                newActionsBar.appendChild(secondButton);

                newActionsBar.appendChild(overflowButton);
                newActionsBar.appendChild(actionsPopover);

                overflowButton.onclick = function (e) {
                    newActionsBar.parentNode.querySelector('.has_tabs').classList.remove('active');
                    actionsPopover.classList.toggle('active');
                    e.preventDefault();
                };
            } else {

                for (var y = 0; y < i; y++) {
                    var actionButton = document.createElement('button'),
                        lbl = actionButtons[y].querySelector('span').innerHTML,
                        icon = actionButtons[y].querySelector('img').getAttribute('src');
                    actionButton.style.backgroundImage = 'url( ' + icon + ' )';
                    actionButton.setAttribute('content', icon);
                    newActionsBar.appendChild(actionButton);
                }
            }

            // Hide the old footer
            actionBar.classList.remove('revealed');
            actionBar.style.display = 'none';
        });

    },

    /**
     * Validates that a given DOM node element is a Ubuntu UI Tab.
     * @method {DOM Element} isTab
     * @return {Boolean} if the DOM element is a tab
     */
    isTab: function (element) {
        return element.tagName.toLowerCase() === 'div' &&
            element.hasAttribute('data-role') &&
            element.getAttribute('data-role') === 'tab';
    },

    /**
     * @private
     */
    __updateVisibleState: function (displayStyle, footerHandlerFunc) {
        if (!this.__isValidId(this.id))
            return;
        var tab = document.getElementById(this.id);
        if (!this.isTab(tab)) {
            return;
        }
        tab.style.display = displayStyle;
        var footer = tab.querySelector('footer');
        footerHandlerFunc(footer);
    },

    /**
     * @private
     */
    __hideVisibleSibling: function () {
        if (!this.__isValidId(this.id))
            return;
        var tab = document.getElementById(this.id);
        if (!this.isTab(tab)) {
            return;
        }
        var children = tab.parentNode.children;
        for (var idx = 0; idx < children.length; ++idx) {
            if (this.isTab(children[idx])) {
                children[idx].style.display = 'none';
            }
        }
    },

    /**
     * @private
     */
    __isValidId: function (id) {
        return id && typeof (id) === 'string';
    },

    /**
     * @private
     */
    get __thisSelector() {
        return "#" + this.id;
    }
};