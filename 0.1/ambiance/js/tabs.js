/* Tabs */
var Tabs = function (selector) {
    var tabs,
        pageX,
        pageY,
        isScrolling,
        deltaX,
        deltaY,
        offsetX,
        resistance,
        tabsWidth;

    tabs = document.querySelector(selector);

    var getScroll = function () {
        var translate3d = tabs.style.webkitTransform.match(/translate3d\(([^,]*)/);
        return parseInt(translate3d ? translate3d[1] : 0)
    };

    var setTouchInProgress = function (val) {

        //Add or remove event listeners depending on touch status
        if (val === true) {
            tabs.addEventListener(UI.touchEvents.touchMove, onTouchMove);
            tabs.addEventListener(UI.touchEvents.touchEnd, onTouchEnd);

            //we only have leave events on desktop, we manually calcuate leave on touch as its not supported in webkit
            if (UI.touchEvents.touchLeave) {
                tabs.addEventListener(UI.touchEvents.touchLeave, onTouchLeave);
            }
        } else {
            tabs.removeEventListener(UI.touchEvents.touchMove, onTouchMove, false);
            tabs.removeEventListener(UI.touchEvents.touchEnd, onTouchEnd, false);

            //we only have leave events on desktop, we manually calcuate leave on touch as its not supported in webkit
            if (UI.touchEvents.touchLeave) {
                tabs.removeEventListener(UI.touchEvents.touchLeave, onTouchLeave, false);
            }
        }
    };

    var onTouchStart = function (e) {
        if (!tabs) return;

        isScrolling = undefined;
        tabsWidth = tabs.offsetWidth;
        resistance = 1;

        if (!UI.isTouch) {
            e.touches = [{
                pageX: e.pageX,
                pageY: e.pageY
            }];
        }
        pageX = e.touches[0].pageX;
        pageY = e.touches[0].pageY;

        tabs.style['-webkit-transition-duration'] = 0;
        setTouchInProgress(true);
    };

    var onTouchMove = function (e) {
        if (!UI.isTouch) {
            e.touches = [{
                pageX: e.pageX,
                pageY: e.pageY
            }];
        }
        deltaX = e.touches[0].pageX - pageX;
        deltaY = e.touches[0].pageY - pageY;
        pageX = e.touches[0].pageX;
        pageY = e.touches[0].pageY;

        console.log(pageY);
        console.log(pageX);

        if (typeof isScrolling == 'undefined') {
            isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
        }

        if (isScrolling) return;
        offsetX = (deltaX / resistance) + getScroll();

        e.preventDefault();
        tabs.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
    };

    var onTouchEnd = function (e) {
        if (!tabs || isScrolling) return;

        offsetX = 0 * tabsWidth;
        tabs.style['-webkit-transition-duration'] = '.2s';
        tabs.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
        setTouchInProgress(false);
    };

    var onTouchLeave = function (e) {};

    tabs.addEventListener(UI.touchEvents.touchStart, onTouchStart);
    tabs.addEventListener(UI.touchEvents.touchMove, onTouchMove);
    tabs.addEventListener(UI.touchEvents.touchEnd, onTouchEnd);
    tabs.addEventListener(UI.touchEvents.touchLeave, onTouchEnd);
};