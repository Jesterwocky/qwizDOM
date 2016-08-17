const DomNodes = require("./dom_nodes.js");

const qwizDomQueue = [];

window.$qwizDOM = function(arg) {
  if (typeof arg === "string"){
    let results = Array.from(document.querySelectorAll(arg));
    return new DomNodes(results);
  }

  else if (arg instanceof Function) {
    if (document.readyState === "loading") {
      qwizDomQueue.push(arg);
    }

    else {
      arg();
    }
  }

  else if (arg instanceof Object) {
    return new DomNodes([arg]);
  }
};

$qwizDOM.extend = function(...args) {
  Object.assign(args[0], ...args.slice(1));
};

$qwizDOM.ajax = function(options) {
  const defaults = {
    url: "http://localhost:3000/",
    type: "GET",
    data: {},
    dataType: "json",
    success: function(){},
    error: function(){}
  };

  $qwizDOM.extend(defaults, options);

  const request = new XMLHttpRequest();

  success = function(request) {
    if (request.status === 200) {
      defaults.success(request.response);
    }

    else {
      defaults.error(request.response);
    }
  };

  error = function(request) {
    defaults.error(request.response);
  };

  request.addEventListener("load", success);
  request.addEventListener("error", error);
  request.addEventListener("abort", error);

  request.open(defaults.type, defaults.url);
  request.send(defaults.data);
};

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    for (let func of qwizDomQueue) {
      func();
    }
  }
};
