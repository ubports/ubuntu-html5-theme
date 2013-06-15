!function () {
  var findToolbars = function (target) {
    var i,
        toolbars = document.querySelectorAll('footer[data-role="toolbar"]');

    for (; target && target !== document; target = target.parentNode) {
      for (i = toolbars.length; i--;) { if (toolbars[i] === target) return target; }
    }
  };

  window.addEventListener('touchend', function (event) {
    var toolbar = findToolbars(event.target);
    if (!toolbar) return;


    if (toolbar) toolbar.classList.toggle('revealed');
  });
}();