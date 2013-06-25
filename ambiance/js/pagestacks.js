/* Pagestack */
var Pagestack = function () {};

Pagestack.prototype = {
    changepage: function (id) {
        [].forEach.call(document.querySelectorAll("[data-role='pagestack'] [data-role='page']"), function(el) {
            el.style.display = "none";
        });
        document.getElementById(id).style.display = "block";
    }
};