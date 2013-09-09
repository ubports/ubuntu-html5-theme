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

/* Popover */
var Popover = function (elem, id) {
    this.id = id;
    this.popover = document.getElementById(id);
    this.elem = elem;
    this.parent = elem.parentNode.parentNode.parentNode.parentNode;
    this.is_parent_footer = (this.parent.nodeName.toLowerCase() === "footer");
};

Popover.prototype = {
    show: function () {
        if (this.popover === null) {
            console.error('The popover with the ID #' + this.id + ' doesn\'t exist');
            return;
        }
        var de = document.documentElement,
            w = (de&&de.clientWidth) || document.body.clientWidth,
            ot = 0,
            ol = 0,
            gravity = "s",
            pos_top = 0,
            pos_left = 0,
            pos_right = 0;

        this.popover.classList.add('active');
        popoverWidth = this.popover.offsetWidth;
        popoverHeight = this.popover.offsetHeight;

        gravity = this.popover.getAttribute("data-gravity");

        if (this.is_parent_footer) {
            ot = this.parent.offsetTop;
            ol = this.elem.offsetLeft;
        }
        else {
            ot = this.elem.offsetTop;
            ol = this.elem.offsetLeft;
        }

        switch (gravity) {
            case 'n':
                pos_top = this.elem.offsetTop + this.elem.offsetHeight + 10;
                pos_left = this.elem.offsetLeft + this.elem.offsetWidth / 2 - popoverWidth / 2;
                break;
            case 's':
                if (this.is_parent_footer) {
                    pos_top = ot - popoverHeight - 90;
                    pos_left = ol + this.elem.offsetWidth / 2 - popoverWidth / 2;
                    if (pos_left < 0)
                        pos_left = 5;
                    else {
                        if (pos_left + popoverWidth > w) {
                            pos_left = -1;
                            pos_right = 5;
                        }
                    }

                }
                else {
                    pos_top = ot - popoverHeight - 10;
                    pos_left = ol + this.elem.offsetWidth / 2 - popoverWidth / 2;
                }
                break;
            case 'e':
                pos_top = this.elem.offsetTop + this.elem.offsetHeight / 2 - popoverHeight / 2;
                pos_left = this.elem.offsetLeft - popoverWidth - 10;
                break;
            case 'w':
                pos_top = this.elem.offsetTop + this.elem.offsetHeight / 2 - popoverHeight / 2;
                pos_left = this.elem.offsetLeft + this.elem.offsetWidth + 10;
                break;
        }

        this.popover.style.top = pos_top + 'px';
        if (pos_left === -1) {
            this.popover.style.left = 'auto';
            this.popover.style.right = pos_right+ 'px';
        }
        else
            this.popover.style.left = pos_left+ 'px';

        return this.popover;
    },
    hide: function () {
        this.popover.classList.remove('active');
        this.popover.style.top = '0px';
        this.popover.style.left = '0px';
        return this.popover;
    },
    toggle: function () {
        if (this.popover === null) {
            console.error('The popover with the ID #' + this.id + ' doesn\'t exist');
            return;
        }
        var de = document.documentElement,
            w = (de&&de.clientWidth) || document.body.clientWidth,
            ot = 0,
            ol = 0,
            gravity = "s",
            pos_top = 0,
            pos_left = 0,
            pos_right = 0;

        this.popover.classList.toggle('active');
        popoverWidth = this.popover.offsetWidth;
        popoverHeight = this.popover.offsetHeight;

        gravity = this.popover.getAttribute("data-gravity");

        if (this.is_parent_footer) {
            ot = this.parent.offsetTop;
            ol = this.elem.offsetLeft;
        }
        else {
            ot = this.elem.offsetTop;
            ol = this.elem.offsetLeft;
        }

        switch (gravity) {
            case 'n':
                pos_top = ot + this.elem.offsetHeight + 10;
                pos_left = ol + this.elem.offsetWidth / 2 - popoverWidth / 2;
                break;
            case 's':
                if (this.is_parent_footer) {
                    pos_top = ot - popoverHeight - 90;
                    pos_left = ol + this.elem.offsetWidth / 2 - popoverWidth / 2;
                    if (pos_left < 0)
                        pos_left = 5;
                    else {
                        if (pos_left + popoverWidth > w) {
                            pos_left = -1;
                            pos_right = 5;
                        }
                    }

                }
                else {
                    pos_top = ot - popoverHeight - 10;
                    pos_left = ol + this.elem.offsetWidth / 2 - popoverWidth / 2;
                }
                break;
            case 'e':
                pos_top = ot + this.elem.offsetHeight / 2 - popoverHeight / 2;
                pos_left = ol - popoverWidth - 10;
                break;
            case 'w':
                pos_top = ot + this.elem.offsetHeight / 2 - popoverHeight / 2;
                pos_left = ol + this.elem.offsetWidth + 10;
                break;
        }

        this.popover.style.top = pos_top + 'px';
        if (pos_left === -1) {
            this.popover.style.left = 'auto';
            this.popover.style.right = pos_right+ 'px';
        }
        else
            this.popover.style.left = pos_left+ 'px';

        return this.popover;
    }
};
