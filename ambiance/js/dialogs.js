! function () {
    var dialogToggle;
    var findDialogs = function (target) {
        var i, dialogs = document.querySelectorAll('a', 'button');
        for (; target && target !== document; target = target.parentNode) {
            for (i = dialogs.length; i--;) {
                if (dialogs[i] === target) return target;
            }
        }
    };

    var getDialog = function (event) {
        dialogToggle = findDialogs(event.target);
        if (dialogToggle && dialogToggle.hash) return document.querySelector(dialogToggle.hash);
    };

    window.addEventListener('touchend', function (event) {
        var dialog = getDialog(event);
        if (dialog) dialog.classList.toggle('active');
    });
}();