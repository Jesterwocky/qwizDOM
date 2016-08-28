/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DomNodes = __webpack_require__(1);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	const DomNodes = function(htmlElements){
	  this.htmlElements = htmlElements;
	};

	DomNodes.prototype.addClass = function(arg){
	  for (let el of this.htmlElements) {
	    if (typeof arg === "string") {
	      el.classList.add(arg);
	    }

	    else if (arg instanceof Array) {
	      for (let className of arg) {
	        el.classList.add(className);
	      }
	    }
	  }
	};

	DomNodes.prototype.append = function (arg) {

	  if (arg instanceof DomNodes) {
	    for (let el of arg.htmlElements) {
	      for (let receivingEl of this.htmlElements) {
	        receivingEl.appendChild( el.cloneNode(true) );
	      }
	    }
	  }

	  else if (arg instanceof HTMLElement) {
	    for (let receivingEl of this.htmlElements) {
	      receivingEl.appendChild(arg.cloneNode(true));
	    }
	  }

	  else if (typeof arg === "string") {
	    this.htmlElements.forEach((receiver) => {
	      receiver.innerHTML += arg;
	    });
	  }
	};

	DomNodes.prototype.attr = function(key, value){
	  if (value === undefined && key === undefined ) return -1;

	  let firstEl = this.htmlElements[0];

	  if (value === undefined){
	    return firstEl.getAttribute(key);
	  }

	  else {
	    let attr = document.createAttribute(key);
	    attr.value = value;
	    firstEl.setAttributeNode(attr);
	  }
	};

	DomNodes.prototype.children = function (selector) {
	  let children = [];

	  for (let el of this.htmlElements) {
	    if (selector === undefined) {
	      children = children.concat(Array.from(el.children));
	    }

	    else {
	      children = children.concat(Array.from(el.querySelectorAll(selector)));
	    }
	  }

	  return new DomNodes(children);
	};

	DomNodes.prototype.empty = function(){
	  this.html("");
	};

	DomNodes.prototype.find = function(selector){
	  let matches = [];

	  for (let parentEl of this.htmlElements) {
	    let matchingChildren = parentEl.querySelectorAll(selector);
	    matches = matches.concat(Array.from(matchingChildren));
	  }

	  return new DomNodes(matches);
	};

	DomNodes.prototype.html = function (str) {
	  if (typeof str === "string") {
	    for (let el of this.htmlElements) {
	      el.innerHTML = str;
	    }
	  }

	  else return this.htmlElements[0].innerHTML;
	};

	DomNodes.prototype.off = function(action, callback) {
	  for (let el of this.htmlElements) {
	    el.removeEventListener(action, callback);
	  }
	};

	DomNodes.prototype.on = function (action, callback) {
	  for (let el of this.htmlElements) {
	    el.addEventListener(action, callback);
	  }
	};

	DomNodes.prototype.parent = function (selector) {
	  let parents = [];

	  for (let el of this.htmlElements) {
	    let parent = el.parentNode;

	    if (parent.matches(selector) || selector === undefined) {
	      if (parents.indexOf(parent) === -1) {
	        parents.push(parent);
	      }
	    }

	  }

	  return new DomNodes(parents);
	};

	DomNodes.prototype.remove = function () {
	  for (let el of this.htmlElements) {
	    el.parentNode.removeChild(el);
	  }
	};

	DomNodes.prototype.removeClass = function (arg) {
	  for (let el of this.htmlElements) {
	    if (typeof arg === "string") {
	      el.classList.remove(arg);
	    }

	    else if (arg instanceof Array) {
	      for (let className of arg) {
	        el.classList.remove(className);
	      }
	    }
	  }
	};

	module.exports = DomNodes;


/***/ }
/******/ ]);