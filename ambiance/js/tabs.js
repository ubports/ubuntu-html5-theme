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

}();