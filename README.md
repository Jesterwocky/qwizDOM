# qwizDOM

qwizDOM is a lightweight DOM manipulation library that functions much like JQuery.

## To Use

To use qwizDOM in a project:

0. Download this repo.
0. Add dom_nodes.js and qwizdom_main.js to your project directory.
0. Bundle dom_nodes.js and qwizdom_main.js (using, e.g., webpack).
0. Add a `script` tag to your HTML file with `src=` [relative path to the bundled file].

## Sandbox
This repo includes a sample HTML file to use as a sandbox. To try qwizDOM:

0. Download the repo.
0. Bundle dom_nodes.js and qwizdom_main.js (using, e.g., webpack) to create a file named qwizDOM.js in the lib folder.
0. Open sandbox.html in Chrome.

You can then use qwizDOM in the Chrome console.

## `$qwizDOM(arg)`
Takes a string, function, or object as an argument.
* If given a CSS selector (string), returns a new DomNodes collection of HTML elements that match the specified selector.
* If given an HTMLElement object, returns a new DomNodes collection with that HTMLElement object as the sole item in the collection.
* If given a function, executes that function immediately if the document has loaded. Otherwise, adds the function to a queue of functions to execute when the document is ready.

### `$qwizDOM.ajax(options)`
Takes an options object and makes an AJAX call using those options. Options can include:
* `url`: URL to receive the AJAX request.
* `type`: HTTP verb as a string. "GET" is the default.
* `data`: object to send with the request. By default, an empty object.
* `dataType`: string representing the format for data returned as a response. "json" is the default.
* `success`: callback that will be called if the request is successful (returns a non-400/500 status code).
* `error`: callback that will be called if the request is not successful (returns a status code in the 400s or 500s).

Creates a promise to handle the results of the AJAX request:

```
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
```

### `$qwizDOM.extend(...args)`
Takes any number of objects as arguments, and assigns to the first object the properties of all the other objects. Calls Object.assign().

## `DomNodes()`
The DomNodes class constructor takes an array of HTML elements and packages them as a property of a new DomNodes object.

The following methods are available for DomNodes objects:
* `.addClass(arg)`
* `.append(arg)`
* `.attr(attributeName, value)`
* `.children(selector)`
* `.empty()`
* `.find(selector)`
* `.html(string)`
* `.off(actionName, callback)`
* `.on(actionName, callback)`
* `.parent(selector)`
* `.remove()`
* `.removeClass(arg)`

### `.addClass(arg)`
Takes a single class name or array. Adds the specified class(es) to the list of classes for each element in the collection.

### `.append(arg)`
Appends the input to each element in the collection. Takes another DomNodes object, an HTMLElement, or a string.

* If passed a DomNodes object, appends a copy of each HTML element in the collection as children of each element in the original collection.
* If passed an HTML element, appends a copy of that HTML element as a child of each element in the DomNodes collection.
* If passed a string, appends the string to the innerHTML of each element in the collection.

### `.attr(attributeName, value)`
If given only a attribute name, returns the value of that attribute for the first element in the collection.

If given both a attribute name and a value, sets the attribute to that value for the first element in the collection.

### `.children(selector)`
Returns a DomNodes object containing the children of all HTML elements in the collection. If a CSS selector is specified, the resulting DomNodes collection contains only children that match the selector.

### `.empty()`
Empties the DomNodes object of HTML elements. Calls .html() with an empty string.

### `.find(selector)`
Returns a DomNodes object collecting all child elements that match the specified CSS selector.

To get matching nodes child elements, .querySelectorAll() is called on each element in the collection, passing the specified selector as the argument.

### `.html(string)`
If given no argument, returns the innerHTML of the first element in the collection.

If given an argument (a string), assigns that string as the innerHTML of all elements in the collection.

### `.off(actionName, callback)`
For each node in the collection, removes the event listener that listens for the specified action and calls the specified callback.

Calls .removeEventListener() on each node, passing the action name and the callback as arguments.

### `.on(actionName, callback)`
For each node in the collection, adds an event listener that listens for the specified action and calls the specified callback.

Calls .addEventListener() on each node, passing the action name and the callback as arguments.

### `.parent(selector)`
Returns a DomNodes object containing the parents of all HTML elements in the collection. If a CSS selector is specified, the resulting DomNodes collection contains only parents that match the selector.

The resulting DomNodes object contains no duplicates. If all nodes have the same parent, then the collection contains a single node.

### `.remove()`
Removes all nodes in the collection from their parent nodes.

For each node in the collection, uses .parentNode.removeChild(node) to find the node's parent and remove the node as its child.

### `.removeClass(arg)`
Takes a single class name or array. Removes the specified class(es) from each element in the collection.
