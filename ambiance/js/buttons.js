/* Buttons */
var Button = function (id) {
    this.id =  id;
};

Button.prototype = {
    click: function (callback) {
        new FastButton(document.getElementById(this.id), callback);
    }
};