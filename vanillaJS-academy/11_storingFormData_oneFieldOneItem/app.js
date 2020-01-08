(function() {
  var storagePrefix = "field-autosave_";

  var formFields = Array.prototype.slice.call(
    document.querySelectorAll("#save-me input, #save-me textarea")
  );

  var getID = function(field) {
    if (field.id.length > 0) {
      return field.id;
    }

    if (field.name.length > 0) {
      return field.name;
    }

    return null;
  };

  // Loop through each form field and load any saved data
  var loadFieldsFromStorage = function() {
    formFields.forEach(field => {
      // if the field has no ID, skip it
      var id = getID(field);
      if (!id) return;

      // If there's no saved value in local storage, skip it
      var saved = localStorage.getItem(storagePrefix + id);
      if (!saved) return;

      // Set the field value to the saved data in localStorage
      field.value = saved;
    });
  };

  // remove items for each field from localStorage when submit pressed
  var clearData = function() {
    formFields.forEach(function(field) {
      // if the field has no ID, skip it
      var id = getID(field);
      if (!id) return;

      // remove item from localStorage
      localStorage.removeItem(storagePrefix + id);
    });
  };

  // Save inputted field values to own localStorage item, with field ID as key.
  document.addEventListener(
    "input",
    function(event) {
      // Only run for fields in the #save-me form
      if (!event.target.closest("#save-me")) return;

      var id = getID(event.target);
      if (!id) return;

      localStorage.setItem(storagePrefix + id, event.target.value);
    },
    false
  );

  document.addEventListener(
    "submit",
    function() {
      //check the submit button is that of the #save-me form
      if (event.target.id != "save-me") return;

      clearData();
    },
    false
  );

  loadFieldsFromStorage();
})();
