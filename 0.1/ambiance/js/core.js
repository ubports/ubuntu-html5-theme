var UbuntuUI = function () {};

UbuntuUI.prototype = {
    init: function () {
        var U = this;
        U.isTouch = "ontouchstart" in window;
        U.touchEvents = {
            touchStart: U.isTouch ? 'touchstart' : 'mousedown',
            touchMove: U.isTouch ? 'touchmove' : 'mousemove',
            touchEnd: U.isTouch ? 'touchend' : 'mouseup'
        };
    },

    button: function (id) {
        if (typeof Button != 'undefined' && Button) {
            return new Button(id);
        } else {
            console.log('Oh nose!');
        }
    },

    dialog: function (id) {
        if (typeof Dialog != 'undefined' && Dialog) {
            return new Dialog(id);
        } else {
            console.log('Oh nose!');
        }
    },

    popover: function (elem, id) {
        if (typeof Popover != 'undefined' && Popover) {
            return new Popover(elem, id);
        } else {
            console.log('Oh nose!');
        }
    },

    pagestack: function () {
        return new Pagestack();
    }
};
