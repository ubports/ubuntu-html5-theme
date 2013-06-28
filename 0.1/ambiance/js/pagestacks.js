/* Pagestack */
var Pagestack = (function () {
    
    function __safeCall(f, args, errorfunc) {
	if (typeof(f) !== 'function')
	    return;
	try {
	    f.apply(null, args);
	}
	catch(e) { if (errorfunc && typeof(errorfunc) === 'function') errorfunc(e) }
    };

    function Pagestack () {
	this._pages = [];
    };

    Pagestack.prototype = {
	__setAllPagesVisibility: function (visible) {
	    var visibility = visible ? "block" : "none";
	    [].forEach.call(document.querySelectorAll("[data-role='pagestack'] [data-role='page']"), function(el) {
		el.style.display = visibility;
	    });
	},
	__deactivate: function (id) {
	    document.getElementById(id).style.display = "none";
	},
	__activate: function (id) {
	    document.getElementById(id).style.display = "block";
	},
	push: function (id, properties) {
	    try {
		__safeCall(this.__setAllPagesVisibility.bind(this), [false]);
		
		if (id) {
		    document.getElementById(id).style.display = "block";
		    this._pages.push(id);
		}
	    }
	    catch(e) {}
	},
	isEmpty: function () {
	    return this._pages.length === 0;
	},
	currentPage: function () {
	    return this.isEmpty() ? null : this._pages[this._pages.length-1];
	},
	depth: function() {
	    return this._pages.length;
	},
	clear: function() {
	    if (this.isEmpty())
		return;
	    __safeCall(this.__deactivate.bind(this), [this.currentPage()]);
	    this._pages = [];
	},
	pop: function() {
	    if(this.isEmpty())
		return;
	    __safeCall(this.__deactivate.bind(this), [this.currentPage()]);
	    this._pages.pop();
	    __safeCall(this.__activate.bind(this), [this.currentPage()]);
	}
    }

    return Pagestack;
})();
    
