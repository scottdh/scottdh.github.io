var helpMe = (function() {
  var methods = {};

  methods.nodeToArray = function(nodeList) {
    return Array.prototype.slice.call(nodeList);
  };

  methods.getfirst = function(selector) {
    return document.querySelector(selector);
  };

  methods.getAll = function(selector) {
    return methods.nodeToArray(document.querySelectorAll(selector));
  };

  methods.addClassToAll = function(arr, classToAdd) {
    if (!Array.isArray(arr)) {
      console.log("Input is not an array");
    } else {
      arr.forEach(element => {
        element.classList.add(classToAdd);
      });
    }
  };

  methods.removeClassFromAll = function(arr, classToRemove) {
    if (!Array.isArray(arr)) {
      console.log("Input is not an array");
    } else {
      arr.forEach(element => {
        element.classList.remove(classToRemove);
      });
    }
  };

  return methods;
})();
