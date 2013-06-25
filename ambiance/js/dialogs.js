/* Dialogs */
Dialog = function (id) {
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