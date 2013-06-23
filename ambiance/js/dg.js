function Dialog(selector){
    this.dialog = document.querySelector(selector);
}

UbuntuJS.Dialog.prototype = {
    show: function(){
        this.dialog.classList.add('active');
    },
    close: function(){
        this.dialog.classList.remove('active');
    }
};





! function () {
    var dialog;
    var isTouch = "ontouchend" in document;
    var e = isTouch ? 'touchstart' : 'click';

    console.log(e);
    function s(event) {
        dialog = document.querySelector(this.hash);
        dialog.classList.toggle('active');
    }
    document.querySelector("[data-role='button']").addEventListener( e, s, false );
}();