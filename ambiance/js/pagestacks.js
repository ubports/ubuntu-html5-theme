/* Pagestack */
Pagestack = function () {

    window.addEventListener("popstate", function(e) {
    // URL location
    var location = document.location;
    // state
    var state = e.state;
    // return to last state

    console.log(state);
    /*if (state.view == "EMAILCONTENT") {
        changepage();
    }*/
});

};

Pagestack.prototype = {
    changepage: function (id) {
        [].forEach.call(document.querySelectorAll("[data-role='pagestack'] [data-role='page']"), function(el) {
            el.style.display = "none";
        });
        document.getElementById(id).style.display = "block";
        if (history && history.pushState) {
            history.pushState( { page:"id" } , document.title, this.href);
        }
    }
};