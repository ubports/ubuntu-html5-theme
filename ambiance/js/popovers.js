/* Popover */
Popover = function (elem, id) {
    var actualWidth = null,
        actualHeight = null,
        gravity = null;

    this.popover = document.getElementById(id);
    this.elem = elem;
};

Popover.prototype = {
    show: function () {
        this.popover.classList.add('active');

        popoverWidth = this.popover.offsetWidth;
        popoverHeight = this.popover.offsetHeight;

        gravity = this.popover.getAttribute("data-gravity");

        switch (gravity) {
            case 'n':
                pos_top = this.elem.offsetTop + this.elem.offsetHeight + 10;
                pos_left = this.elem.offsetLeft + this.elem.offsetWidth / 2 - popoverWidth / 2;
                break;
            case 's':
                pos_top = this.elem.offsetTop - popoverHeight - 10;
                pos_left = this.elem.offsetLeft + this.elem.offsetWidth / 2 - popoverWidth / 2;
                break;
            case 'e':
                pos_top = this.elem.offsetTop + this.elem.offsetHeight / 2 - popoverHeight / 2;
                pos_left = this.elem.offsetLeft - popoverWidth - 10;
                break;
            case 'w':
                pos_top = this.elem.offsetTop + this.elem.offsetHeight / 2 - popoverHeight / 2;
                pos_left = this.elem.offsetLeft + this.elem.offsetWidth + 10;
                break;
        }

        this.popover.style.top = pos_top + 'px';
        this.popover.style.left = pos_left + 'px';
        return this.popover;
    },
    hide: function () {
        this.popover.classList.remove('active');
        this.popover.style.top = '0px';
        this.popover.style.left = '0px';
        return this.popover;
    },
    toggle: function () {
        this.popover.classList.toggle('active');
        popoverWidth = this.popover.offsetWidth;
        popoverHeight = this.popover.offsetHeight;

        gravity = this.popover.getAttribute("data-gravity");

        switch (gravity) {
            case 'n':
                pos_top = this.elem.offsetTop + this.elem.offsetHeight + 10;
                pos_left = this.elem.offsetLeft + this.elem.offsetWidth / 2 - popoverWidth / 2;
                break;
            case 's':
                pos_top = this.elem.offsetTop - popoverHeight - 10;
                pos_left = this.elem.offsetLeft + this.elem.offsetWidth / 2 - popoverWidth / 2;
                break;
            case 'e':
                pos_top = this.elem.offsetTop + this.elem.offsetHeight / 2 - popoverHeight / 2;
                pos_left = this.elem.offsetLeft - popoverWidth - 10;
                break;
            case 'w':
                pos_top = this.elem.offsetTop + this.elem.offsetHeight / 2 - popoverHeight / 2;
                pos_left = this.elem.offsetLeft + this.elem.offsetWidth + 10;
                break;
        }

        this.popover.style.top = pos_top + 'px';
        this.popover.style.left = pos_left + 'px';
        return this.popover;
    }
};