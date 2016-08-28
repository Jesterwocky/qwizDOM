const DomNodes = require("./dom_nodes.js");

const qwizDomQueue = [];

window.$qwizDOM = function(arg) {
  if (typeof arg === "string"){
    let results = Array.from(document.querySelectorAll(arg));
    return new DomNodes(results);
  }

  else if (arg instanceof HTMLElement) {
    return new DomNodes([arg]);
  }

  else if (arg instanceof Function) {
    if (document.readyState === "loading") {
      qwizDomQueue.push(arg);
    }

    else {
      arg();
    }
  }
};

$qwizDOM.extend = function(receivingObject, ...objects) {
  Object.assign(receivingObject, ...objects);
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

  let promise = new Promise(function(resolve, reject) {
    request.open(defaults.type, defaults.url);
    request.send(defaults.data);

    if (400 <= request.status && request.status < 600) {
      reject(request.response);
    }

    else {
      resolve(request.response);
    }
  });

  promise.then(
    function(result) {defaults.success(results);},
    function(errors) {defaults.error(errors);}
  );
};

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    for (let func of qwizDomQueue) {
      func();
    }
  }
};
