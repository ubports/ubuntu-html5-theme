/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of ubuntu-html5-theme.
 *
 * ubuntu-html5-theme is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * webbrowser-app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* Toolbars */
var Toolbar = function (id) {
    this.toolbar = document.getElementById(id);
};

Toolbar.prototype = {
    show: function () {
        this.toolbar.classList.add('revealed');
    },
    hide: function () {
        this.toolbar.classList.remove('revealed');
    },
    toggle: function () {
        this.toolbar.classList.toggle('revealed');
    },
    touch: function (callback) {
        this.toolbar.addEventListener(UI.touchEvents.touchEnd, callback);
    }
};
