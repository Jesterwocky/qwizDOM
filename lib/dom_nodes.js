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
