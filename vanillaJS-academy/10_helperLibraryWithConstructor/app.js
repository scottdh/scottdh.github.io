var $ = (function() {
  var Constructor = function(selector) {
    this.elems = document.querySelectorAll(selector);
  };

  Constructor.prototype.items = function() {
    return Array.prototype.slice.call(this.elems);
  };

  Constructor.prototype.getFirst = function() {
    return this.elems[0];
  };

  Constructor.prototype.getLast = function() {
    var list = this.items();
    return list[list.length - 1];
  };

  Constructor.prototype.addClassToAll = function(classToAdd) {
    this.items().forEach(element => {
      element.classList.add(classToAdd);
    });
    return this;
  };

  Constructor.prototype.removeClassFromAll = function(classToRemove) {
    this.items().forEach(element => {
      element.classList.remove(classToRemove);
    });
    return this;
  };

  return Constructor;
})();

var btns = new $("button");
var list = new $("ul");
console.log("$.items()", btns.items());
console.log("$.items()", list.items());
console.log("first button", btns.getFirst());
console.log("last button", btns.getLast());
btns.addClassToAll("btn-purple").removeClassFromAll("btn-blue");
