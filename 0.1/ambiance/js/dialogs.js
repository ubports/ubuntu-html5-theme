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

/* Dialogs */
var Dialog = function (id) {
    this.dialog = document.getElementById(id);
};

Dialog.prototype = {
    show: function () {
        this.dialog.classList.add('active');
    },
    hide: function () {
        this.dialog.classList.remove('active');
    },
    toggle: function () {
        this.dialog.classList.toggle('active');
    }
};
