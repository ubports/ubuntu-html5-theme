var UbuntuUI = function () {
    var U = this;
    U.isTouch = "ontouchstart" in window;
    U.touchEvents = {
        touchStart: U.isTouch ? 'touchstart' : 'mousedown',
        touchMove: U.isTouch ? 'touchmove' : 'mousemove',
        touchEnd: U.isTouch ? 'touchend' : 'mouseup',
        touchLeave : U.isTouch ? null : 'mouseleave' //we manually detect leave on touch devices, so null event here
    };
};

UbuntuUI.prototype = {
    init: function () {},

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

    pagestack: function () {
        return new Pagestack();
    }
};
