(function() {
  var storageID = "form-autosave";

  var formFields = Array.prototype.slice.call(
    document.querySelectorAll(
      "#save-me input, #save-me textarea, #save-me select"
    )
  );
  console.log(formFields);

  // Helper function. We'll use the field ID to identify it in the object saved to localStorage. If the field has no ID, the name will be used as an ID. If it has no name it'll be skipped.
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
    var savedFormData = localStorage.getItem(storageID);

    // Check if any form data has been saved to local storage
    if (!savedFormData) return;

    savedFormData = JSON.parse(savedFormData);

    formFields.forEach(field => {
      // if the field has no ID, skip it
      var id = getID(field);
      if (!id) return;

      // If there's no saved value in savedFormData object, skip it
      if (!savedFormData[id]) return;

      // Set the field value to the saved data in localStorage
      if (field.type === "checkbox") {
        field.checked = savedFormData[id] === "on" ? true : false;
      } else if (field.type === "radio") {
        field.checked = savedFormData[id] === field.value ? true : false;
      } else {
        field.value = savedFormData[id];
      }
    });
  };

  // remove item from localStorage when submit pressed
  var clearData = function() {
    localStorage.removeItem(storageID);
  };

  var inputHandler = function(event) {
    if (!event.target.closest("#save-me")) return;

    var id = getID(event.target);
    if (!id) return;

    var savedFormData = localStorage.getItem(storageID);
    console.log(formFields);

    // If the savedFormData exists (storageID exists in localStorage), assign it to the savedFormData variable. If it doesn't, create an empty object
    //As ternarary... savedFormData = savedFormData ? JSON.parse(savedFormData) : {};
    if (savedFormData) {
      savedFormData = JSON.parse(savedFormData);
    } else {
      savedFormData = {};
    }

    if (event.target.type === "checkbox") {
      savedFormData[id] = event.target.checked ? "on" : "off";
    } else {
      savedFormData[id] = event.target.value;
    }

    localStorage.setItem(storageID, JSON.stringify(savedFormData));
  };

  var submitHandler = function(event) {
    //check the submit button is that of the #save-me form
    if (event.target.id != "save-me") return;

    clearData();
  };

  document.addEventListener("input", inputHandler, false);

  document.addEventListener("submit", submitHandler, false);

  // clear all fields on page refresh
  formFields.forEach(function(field) {
    if (field.type === "checkbox" || field.type === "radio") {
      field.checked = false;
    } else {
      field.value = "";
    }
  });

  loadFieldsFromStorage();
})();
