
/*
!function () {
  var getTarget = function (target) {
    var i, tabs = document.querySelectorAll('.tabs-inner li');
    for (; target && target !== document; target = target.parentNode) {
      for (i = tabs.length; i--;) { if (tabs[i] === target) return target; }
    }
  };

  window.addEventListener('click', function (e) {
    var activeTab;
    var targetTab;
    var className     = 'active';
    var classSelector = '.' + className;
    var targetAnchor  = getTarget(e.target);

    if (!targetAnchor) return;

    targetTab = targetAnchor;
    activeTab = targetTab.parentNode.querySelector(classSelector);

    // Highlight the target tab
    if (activeTab) activeTab.classList.remove(className);
    targetTab.classList.add(className);

  });

}();*/



!function () {

  var tabs;
  var pageX;
  var pageY;
  var tabNumber;

  var getTabs = function (target) {
    var tabs = document.querySelector('.tabs-inner ul');
    for (; target && target !== document; target = target.parentNode) {
      if (tabs === target) return target;
    }
  };

  var getScroll = function () {
    var translate3d = tabs.style.webkitTransform.match(/translate3d\(([^,]*)/);
    return parseInt(translate3d ? translate3d[1] : 0)
  };

  var onTouchStart = function (e) {
    tabs = getTabs(e.target);
    if (!tabs) return;

    isScrolling    = undefined;
    tabsWidth    = tabs.offsetWidth;
    resistance     = 1;
    pageX          = e.touches[0].pageX;
    pageY          = e.touches[0].pageY;
    lastTab      = -(tabs.children.length - 1);

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
    resistance = tabNumber == 0         && deltaX > 0 ? (pageX / tabsWidth) + 1.25 :
                 tabNumber == lastTab && deltaX < 0 ? (Math.abs(pageX) / tabsWidth) + 1.25 : 1;

    tabs.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
  };


  var onTouchEnd = function (e) {
    if (!tabs || isScrolling) return;

    offsetX = tabNumber * tabsWidth;

    tabs.style['-webkit-transition-duration'] = '.2s';
    tabs.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
  };

  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchmove', onTouchMove);
  window.addEventListener('touchend', onTouchEnd);

}();