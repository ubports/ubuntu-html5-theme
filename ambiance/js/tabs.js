!function () {

  var tabs;
  var pageX;
  var pageY;
  var isScrolling;
  var tabsItems;
  var tab;


  var getTabs = function (target) {
    var tabs = document.querySelector('.tabs-inner ul');
    for (; target && target !== document; target = target.parentNode) {
      if (tabs === target) return target;
    }
  };


  var findTabs = function (target) {
    var i;
    i, tabsItems = document.querySelectorAll('a.tab-item');
    for (; target && target !== document; target = target.parentNode) {
      for (i = tabsItems.length; i--;) { if (tabsItems[i] === target) return target; }
    }
  };

  var getScroll = function () {
    var translate3d = tabs.style.webkitTransform.match(/translate3d\(([^,]*)/);
    return parseInt(translate3d ? translate3d[1] : 0)
  };

  var onTouchStart = function (e) {
    tabs = getTabs(e.target);
    if (!tabs) return;

    isScrolling = undefined;
    tabsWidth   = tabs.offsetWidth;
    resistance  = 1;
    pageX       = e.touches[0].pageX;
    pageY       = e.touches[0].pageY;

    tabs.style['-webkit-transition-duration'] = 0;
  };


  var onTouchMove = function (e) {
    if (e.touches.length > 1 || !tabs) return; // Exit if a pinch || no slider

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
    tabs.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
  };

  var onTouchEnd = function (e) {
    if (!tabs || isScrolling) return;

    offsetX = 0 * tabsWidth;
    tabs.style['-webkit-transition-duration'] = '.2s';
    tabs.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
  };

  var getTab = function (e) {
    var anchor = findTabs(e.target);

    if (!anchor || !anchor.hash) return;
    for (i = tabsItems.length; i--;) {
      tabsItems[i].style['-webkit-transition-duration'] = '.2s';

      tabsItems[i].style.display = 'block';
      tabsItems[i].style.opacity = '1';
    }

    return anchor;
  };

  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchmove', onTouchMove);
  window.addEventListener('touchend', onTouchEnd);
  window.addEventListener('click', function (e) { if (getTab(e)) e.preventDefault(); });

}();