# qwizDOM

qwizDOM is a lightweight DOM manipulation library that functions much like JQuery.

## Sandbox
This repo includes a sample HTML file to use as a sandbox. To try qwizDOM:
1. Download the repo.
1. Run webpack with main.js as the entry point and qwizDOM.js as the output.
1. Open sandbox.html in Chrome.

You can then use qwizDOM in the Developer Tools console.

## `$qwizDOM(arg)`
Takes a string, function, or object as an argument.
* Given a CSS selector (string), returns a new DomNodes collection of HTML elements that match the specified selector.
* Given an HTMLElement object, returns a new DomNodes collection with that HTMLElement object as the sole item in the collection.
* Given a function, executes that function immediately if the document has loaded. Otherwise, adds the function to a queue of functions to execute when the document is ready.

```
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
```

### `$qwizDOM(options)`
Takes an options object and makes an AJAX call using those options. Options can include:
* `url`: URL to receive the AJAX request.
* `type`: HTTP verb as a string. "GET" is the default.
* `data`: object to send with the request. By default, an empty object.
* `dataType`: string representing the format for data returned as a response. "json" is the default.
* `success`: callback that will be called if the request is successful (returns a non-400/500 status code).
* `error`: callback that will be called if the request is not successful (returns a status code in the 400s or 500s).

Creates a promise to handle the results of the AJAX request.

```
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
```

### `$qwizDOM.extend(...args)`
Takes any number of objects as arguments, and assigns to the first object the properties of all the other objects. Calls Object.assign().

## `DomNodes()`
The DomNodes class constructor takes an array of HTML elements and packages them as a property of a new DomNodes object.
```
const DomNodes = function(htmlElements){
  this.htmlElements = htmlElements;
};
```
The following methods are available for DomNodes objects:
* `.addClass(string)`
* `.append(arg)`
* `.attr(attributeName, value)`
* `.children()`
* `.empty()`
* `.find(selector)`
* `.html(string)`
* `.off(actionName, callback)`
* `.on(actionName, callback)`
* `.parent()`
* `.remove()`
* `.removeClass(className)`


### `.addClass(string)`
Adds the specified class name to the list of classes for each HTML element in the collection.
```
DomNodes.prototype.addClass = function(newClass){
  for (let el of this.htmlElements) {
    el.classList.add(newClass);
  }
};
```

### `.append(arg)`
Appends the input to each element in the collection. Takes another DomNodes object, an HTMLElement, or a string.

* If passed a DomNodes object, appends a copy of each HTML element in the collection as children of each element in the original collection.
* If passed an HTML element, appends a copy of that HTML element as a child of each element in the DomNodes collection.
* If passed a string, appends the string to the innerHTML of each element in the collection.

```
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
```

### `.attr(attributeName, value)`
Given only a attribute name, returns the value of that attribute for the first element in the collection.

Given both a attribute name and a value, sets the attribute to that value for the first element in the collection.

```
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
```

### `.children()`
Returns a DomNodes object containing the children of all HTML elements in the collection.

```
DomNodes.prototype.children = function () {
  let children = [];

  for (let el of this.htmlElements) {
    children = children.concat(Array.from(el.children));
  }

  return new DomNodes(children);
};
```

### `.empty()`
Empties the DomNodes object of HTML elements. Calls .html() with an empty string.

```
DomNodes.prototype.empty = function(){
  this.html("");
};
```

### `.find(selector)`
Returns a DomNodes object collecting all child elements that match the specified CSS selector.

To get matching nodes child elements, .querySelectorAll() is called on each element in the collection, passing the specified selector as the argument.

```
DomNodes.prototype.find = function(selector){
  let matches = [];

  for (let parentEl of this.htmlElements) {
    let matchingChildren = parentEl.querySelectorAll(selector);
    matches = matches.concat(Array.from(matchingChildren));
  }

  return new DomNodes(matches);
};
```

### `.html(string)`
Given no argument, returns the innerHTML of the first element in the collection.

Given an argument (a string), assigns that string as the innerHTML of all elements in the collection.

```
DomNodes.prototype.html = function (str) {
  if (typeof str === "string") {
    for (let el of this.htmlElements) {
      el.innerHTML = str;
    }
  }

  else return this.htmlElements[0].innerHTML;
};
```

### `.off(actionName, callback)`
For each node in the collection, removes the event listener that listens for the specified action and calls the specified callback.

Calls .removeEventListener() on each node, passing the action name and the callback as arguments.

```
DomNodes.prototype.off = function(action, callback) {
  for (let el of this.htmlElements) {
    el.removeEventListener(action, callback);
  }
};
```

### `.on(actionName, callback)`
For each node in the collection, adds an event listener that listens for the specified action and calls the specified callback.

Calls .addEventListener() on each node, passing the action name and the callback as arguments.

```
DomNodes.prototype.on = function (action, callback) {
  for (let el of this.htmlElements) {
    el.addEventListener(action, callback);
  }
};
```

### `.parent()`
Returns a DomNodes object containing the parents of all HTML elements in the collection.

The resulting DomNodes object contains no duplicates. If all nodes have the same parent, then the resulting DomNodes collection contains a single node.

```
DomNodes.prototype.parent = function () {
  let parents = [];

  for (let el of this.htmlElements) {
    let parent = el.parentNode;

    if (parents.indexOf(parent) === -1) {
      parents.push(parent);
    }
  }

  return new DomNodes(parents);
};
```

### `.remove()`
Removes all nodes in the collection from their parent nodes.

For each node in the collection, uses .parentNode.removeChild(node) to find the node's parent and remove the node as its child.

```
DomNodes.prototype.remove = function () {
  for (let el of this.htmlElements) {
    el.parentNode.removeChild(el);
  }
};
```

### `.removeClass(string)`
Removes the specified class from each element in the collection.

Calls .classList.remove() on each element, passing the specified class name as an argument.

```
DomNodes.prototype.removeClass = function (classToRemove) {
  for (let el of this.htmlElements) {
    el.classList.remove(classToRemove);
  }
};
```
