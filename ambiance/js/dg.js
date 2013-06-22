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