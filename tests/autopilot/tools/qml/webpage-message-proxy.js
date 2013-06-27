(function() {

function dispatch(message) {
    if(message.click && message.id) {
	try {
	    document.getElementById(id).click();
	}
	catch(e) {
	    return {status: 'error', message: e};
	}
    }
    return {status: 'ok', message: null};
};

nagivator.qt.onmessage = function (raw) {
    console.log('message received');
    var message = JSON.parse(raw.data);
    var result = dispatch(message);
    result.tid = message.tid;
    navigator.qt.postMessage(JSON.stringify(result));
};

})();

