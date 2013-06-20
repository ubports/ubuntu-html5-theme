!function () {

  var pagestack;
  var pageX;
  var pageY;
  var deltaX;
  var deltaY;
  var offsetX;
  var lastPage;
  var startTime;
  var resistance;
  var pagestackWidth;
  var pageNumber;
  var isScrolling;
  var scrollableArea;

  var getPagestack = function (target) {
    var pagestack = document.querySelector('.pagestack');
    for (; target && target !== document; target = target.parentNode) {
      if (pagestack === target) return target;
    }
  };

  var getScroll = function () {
    var translate3d = pagestack.style.webkitTransform.match(/translate3d\(([^,]*)/);
    return parseInt(translate3d ? translate3d[1] : 0)
  };

  var setPage = function (offset) {
    var round = offset ? (deltaX < 0 ? 'ceil' : 'floor') : 'round';
    pageNumber = Math[round](getScroll() / ( scrollableArea / pagestack.children.length) );
    pageNumber += offset;
    pageNumber = Math.min(pageNumber, 0);
    pageNumber = Math.max(-(pagestack.children.length - 1), pageNumber);
  }

  var onTouchStart = function (e) {
    pagestack = getPagestack(e.target);
    if (!pagestack) return;

    var firstItem  = pagestack.querySelector('.page');
    scrollableArea = firstItem.offsetWidth * pagestack.children.length;

    isScrolling = undefined;
    pagestackWidth   = pagestack.offsetWidth;
    resistance  = 1;
    lastPage      = -(pagestack.children.length - 1);
    startTime      = +new Date;
    pageX       = e.touches[0].pageX;
    pageY       = e.touches[0].pageY;

    setPage(0);
    pagestack.style['-webkit-transition-duration'] = 0;
  };


  var onTouchMove = function (e) {
    if (e.touches.length > 1 || !pagestack) return; // Exit if a pinch || no slider

    deltaX = e.touches[0].pageX - pageX;
    deltaY = e.touches[0].pageY - pageY;
    pageX  = e.touches[0].pageX;
    pageY  = e.touches[0].pageY;

    if (typeof isScrolling == 'undefined') {
      isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
    }

    if (isScrolling) return;
    offsetX = (deltaX / resistance) + getScroll();

    e.preventDefault();
    resistance = pageNumber == 0         && deltaX > 0 ? (pageX / pagestackWidth) + 1.25 :
                 pageNumber == lastPage && deltaX < 0 ? (Math.abs(pageX) / pagestackWidth) + 1.25 : 1;
    pagestack.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
  };

  var onTouchEnd = function (e) {
    if (!pagestack || isScrolling) return;

    setPage(
      (+new Date) - startTime < 1000 && Math.abs(deltaX) > 15 ? (deltaX < 0 ? -1 : 1) : 0
    );
    offsetX = pageNumber * pagestackWidth;
    pagestack.style['-webkit-transition-duration'] = '.2s';
    pagestack.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
  };

  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchmove', onTouchMove);
  window.addEventListener('touchend', onTouchEnd);

}();