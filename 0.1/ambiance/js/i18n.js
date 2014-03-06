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
 * <http://www.gnu.org/licenses/>
 */

/**
 *i18n is a context property that provides internationalization support.
*/
var i18n = (function () {
    var defaultLocale = 'en-US';

    function i18n() {
        var userLocale = navigator.language || navigator.userLanguage;
        this.i18nElements = [];

        console.log("[i18n] Loaded " + this.__getI18nLinks().length + " locale");
        console.log("[i18n] Using " + userLocale + " as locale");

        var nodes = document.getElementsByTagName('*'),
            n = nodes.length;

        for (var i = 0; i < n; i++) {
            if (nodes[i].getAttribute('data-i18n-id'))
                this.i18nElements.push(nodes[i]);
        }
        console.log(this.i18nElements);

        this.__getI18nDict(userLocale);
    }

    i18n.prototype = {
        /**
         * @private
         */
        __getI18nDict: function (lang) {
            var getInlineDict = function (locale) {
                var sel = 'script[type="application/i18n"][lang="' + locale + '"]';
                return document.querySelector(sel);
            };
            var script = getInlineDict(lang) || getInlineDict(defaultLocale);
            return script ? JSON.parse(script.innerHTML) : null;
        },

        /**
         * @private
         */
        __getI18nLinks: function () {
            return document.querySelectorAll('link[type="application/i18n"]');
        }
    };


    return i18n;
})();