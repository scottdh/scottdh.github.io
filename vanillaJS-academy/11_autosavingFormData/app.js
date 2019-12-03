var storagePrefix = "form-autosave_";
var objFormKey = "form-key_";
var formData = {};
var fields = document.querySelectorAll("#save-me input, #save-me textarea");

var getID = function(field) {
  if (field.id.length > 0) {
    return field.id;
  }

  if (field.name.length > 0) {
    return field.name;
  }

  return null;
};

var inputHandler = function(event) {
  // Only run for fields in the #save-me form
  if (!event.target.closest("#save-me")) return;

  // Populate the formData object for all fields in the form, regardless of which field is currently being "inputted".
  Array.prototype.slice.call(fields).forEach(function(field) {
    // If the field has no usable ID, skip it
    var id = getID(field);
    if (!id) return;

    formData[objFormKey + id] = field.value;
  });

  localStorage.setItem("formData", JSON.stringify(formData));
};

var loadData = function() {
  // Check there's a form data object in local storage.
  if (!localStorage.getItem("formData")) return;

  // turn the stringified formData object in local storage back into an object
  var savedData = localStorage.getItem("formData");
  if (savedData) {
    savedData = JSON.parse(savedData);
    console.log(savedData);
  }

  // Loop through each field and load any saved data from the savedData object
  Array.prototype.slice.call(fields).forEach(function(field) {
    // If the field has no usable ID, skip it
    var id = getID(field);
    if (!id) return;

    // If there's no saved value in localStorage, skip it
    // var saved = localStorage.getItem(storagePrefix + id);
    var saved = savedData[objFormKey + id];
    if (!saved) return;

    // Set the field value to the saved data in localStorage
    field.value = saved;
  });
};
var clearData = function() {
  // Remove the item from localStorage
  localStorage.removeItem("formData");
};

var submitHandler = function(event) {
  // Only run for the #save-me form
  if (event.target.id !== "save-me") return;

  // Clear saved data
  clearData();
};

loadData();

document.addEventListener("input", inputHandler, false);

document.addEventListener("submit", submitHandler, false);
