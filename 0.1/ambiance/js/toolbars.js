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