var UbuntuUI = (function () {

    PAGESTACK_BACK_ID = 'ubuntu-pagestack-back';

    function __hasPageStack(document) {
        return document.querySelectorAll("[data-role='pagestack']") != null;
    };

    function UbuntuUI() {
        var U = this;
        U.isTouch = "ontouchstart" in window;
        U.touchEvents = {
            touchStart: U.isTouch ? 'touchstart' : 'mousedown',
            touchMove: U.isTouch ? 'touchmove' : 'mousemove',
            touchEnd: U.isTouch ? 'touchend' : 'mouseup',
            touchLeave: U.isTouch ? null : 'mouseleave' //we manually detect leave on touch devices, so null event here
        };
    };

    UbuntuUI.prototype = {
        __setupPageStack: function (d) {
            // TODO validate no more than one page stack etc.
            // d.querySelectorAll("[data-role='pagestack']")

            // TODO: only add the footer for now, but need to sync w/ title
            //  , properties & header
            var footer;
            if (d.querySelectorAll("[data-role='footer']").length == 0) {
                footer = d.createElement('footer');
                footer.setAttribute('data-role', 'footer');
                footer.setAttribute('class', 'revealed');
            } else {
                // TODO: validate footer count
                footer = d.querySelectorAll("[data-role='footer']")[0];
            }

            var a = d.createElement('a');
            a.setAttribute('href', '#');

            // TODO: validate existence of id
            a.setAttribute('id', PAGESTACK_BACK_ID);

            var img = d.createElement('img');
            img.setAttribute('src', '../../../ambiance/img/back@18.png');

            // TODO: translation?
            img.setAttribute('alt', 'Back');
            a.appendChild(img);
            var span = d.createElement('span');
            var text = d.createTextNode('Back');
            span.appendChild(text);
            a.appendChild(span);

            var li = d.createElement('li');
            li.appendChild(a);

            var ul = null;
            if (footer.querySelectorAll('ul').length == 0) {
                ul = d.createElement('ul');
            } else {
                ul = footer.querySelectorAll('ul')[0];
            }
            ul.appendChild(li);

            if (footer.querySelectorAll('nav').length == 0) {
                var nav = d.createElement('nav');
                nav.appendChild(ul);
                footer.appendChild(nav);
            }

            d.querySelectorAll("[data-role='pagestack']")[0]
                .parentNode
                .appendChild(footer);

            this._pageStack = new Pagestack();
            d.getElementById(PAGESTACK_BACK_ID).onclick = function (e) {
                if (this._pageStack.depth() > 1)
                    this._pageStack.pop();
                e.preventDefault();
            }.bind(this);
        },

        __setupPage: function (document) {
            if (__hasPageStack(document))
                this.__setupPageStack(document);
        },

        init: function () {
            this.__setupPage(document);
        },

        button: function (id) {
            if (typeof Button != 'undefined' && Button) {
                return new Button(id);
            }
        },

        dialog: function (id) {
            if (typeof Dialog != 'undefined' && Dialog) {
                return new Dialog(id);
            }
        },

        popover: function (elem, id) {
            if (typeof Popover != 'undefined' && Popover) {
                return new Popover(elem, id);
            }
        },

        tabs: function (selector) {
            if (typeof Tabs != 'undefined' && Tabs) {
                return new Tabs(selector);
            }
        },

        toolbar: function (id) {
            if (typeof Toolbar != 'undefined' && Toolbar) {
                return new Toolbar(id);
            }
        },

        get pagestack() {
            return this._pageStack;
        }
    };

    return UbuntuUI;

})();