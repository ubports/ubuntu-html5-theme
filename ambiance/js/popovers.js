! function () {
    var popoverToggle;

    var isTouch = function() {
        return "ontouchstart" in document);
    };

    var touchEvents = {
        touchStart : isTouch() ? 'touchstart' : 'mousedown',
        touchMove : isTouch() ? 'touchmove' : 'mousemove',
        touchEnd : isTouch() ? 'touchend' : 'mouseup'
    };

    var findPopovers = function (target) {
        var i, popovers = document.querySelectorAll('a', 'button');
        for (; target && target !== document; target = target.parentNode) {
            for (i = popovers.length; i--;) {
                if (popovers[i] === target) return target;
            }
        }
    };

    var getModal = function (event) {
        popoverToggle = findPopovers(event.target);
        if (popoverToggle && popoverToggle.hash) return document.querySelector(popoverToggle.hash);
    };

    window.addEventListener(touchEvents.touchEnd, function (event) {
        var popover = getModal(event);
        if (popover) popover.classList.toggle('active');

        actualWidth = popover.offsetWidth;
        actualHeight = popover.offsetHeight;

        var gravity = popover.getAttribute("data-gravity");

        switch (gravity) {
            case 'n':
                pos_top = popoverToggle.offsetTop + popoverToggle.offsetHeight + 10;
                pos_left = popoverToggle.offsetLeft + popoverToggle.offsetWidth / 2 - actualWidth / 2;
                break;
            case 's':
                pos_top = popoverToggle.offsetTop - actualHeight - 10;
                pos_left = popoverToggle.offsetLeft + popoverToggle.offsetWidth / 2 - actualWidth / 2;
                break;
            case 'e':
                pos_top = popoverToggle.offsetTop + popoverToggle.offsetHeight / 2 - actualHeight / 2;
                pos_left = popoverToggle.offsetLeft - actualWidth - 10;
                break;
            case 'w':
                pos_top = popoverToggle.offsetTop + popoverToggle.offsetHeight / 2 - actualHeight / 2;
                pos_left = popoverToggle.offsetLeft + popoverToggle.offsetWidth + 10;
                break;
        }

        popover.style.top = pos_top + 'px';
        popover.style.left = pos_left + 'px';
    });

    window.addEventListener('click', function (e) { if (getModal(e)) e.preventDefault(); });
}();