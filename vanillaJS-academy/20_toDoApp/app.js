var field_newToDo = document.querySelector("#new-todo");
var btn_addToDo = document.querySelector("button");
var localStorageID = "todoListData";

var sortList = function(arr) {
  arr.sort(function(a, b) {
    return a.done - b.done;
  });
};

var getListIndex = function(event) {
  return event.target.closest("li").getAttribute("data-listIndex");
};

var app = new Reef("#app", {
  data: {
    listItems: []
  },
  template: function(props) {
    // Sort todos so done are at the bottom

    // If there are no todos, ask the user to add some
    if (props.listItems.length < 1) {
      return "<p>You don't have any todos yet. Add some using the form above.</p>";
    }

    // Generate markup for todo items
    return (
      '<ul class="todos">' +
      props.listItems
        .map(function(todo, index) {
          // Create list item
          var todoHTML =
            "<li " +
            (todo.done ? 'class="todo-done"' : "") +
            "data-listIndex='" +
            index +
            "'>";

          // Open label for checkbox
          todoHTML += "<label for='todo-" + index + "'>";
          //Add checkbox and check if done
          todoHTML +=
            "<input type='checkbox' id='todo-" +
            index +
            "'" +
            (todo.done ? "checked" : "") +
            ">";
          // Add to do text and close label
          todoHTML += todo.item + "</label>";

          // Add required buttons or success message
          if (todo.done) {
            todoHTML += "<div>Smashed it 👍🏻</div>";
          }
          if (!todo.done) {
            // check if todo.confirmDelete is true
            if (todo.confirmDelete) {
              // Show the cancel and confirm delete buttons
              todoHTML +=
                "<div>Sure? <button data-action='cancelDelete'>Cancel</button><button class='destructive' data-action='confirmDelete' >Yup, delete</button></div>";
            } else {
              // show the delete button
              todoHTML += "<button data-action='delete'>Delete</button>";
            }
          }

          // Complete list item
          todoHTML += "</li>";

          return todoHTML;
        })
        .join("") +
      "</ul>"
    );
  }
});

var saveChanges = function() {
  localStorage.setItem(localStorageID, JSON.stringify(app.getData().listItems));
};

var loadSavedList = function() {
  var savedList = localStorage.getItem(localStorageID);

  // Check if any list items have been saved to local storage
  if (!savedList) return;
  // parse stored object back into JSON
  app.setData({ listItems: JSON.parse(savedList) });
};

var submitHandler = function(event) {
  if (event.target.id === "add-todos") {
    event.preventDefault();

    if (field_newToDo.value.length < 1) return;

    var newItem = field_newToDo.value;
    var items = app.getData().listItems;
    items.push({ item: newItem, done: false });
    sortList(items);
    app.setData({ listItems: items });
    saveChanges();

    // Clear the field and return focus
    field_newToDo.value = "";
    field_newToDo.focus();
  }

  return;
};

var clickHandler = function(event) {
  if (event.target.matches("[type='checkbox']")) {
    // Undo default (un)checking behaviour of checkbox. This is because, after sort, whichever item has replaced the checked item in list order also gets checked. Weeeird.
    // event.target.checked = event.target.checked ? false : true;

    var listItemsCopy = app.getData().listItems;
    listItemsCopy[getListIndex(event)].done =
      listItemsCopy[getListIndex(event)].done === false ? true : false;
    sortList(listItemsCopy);
    app.setData({ listItems: listItemsCopy });
    return;
  }

  if (event.target.getAttribute("data-action") === "delete") {
    var items = app.getData().listItems;
    items[getListIndex(event)].confirmDelete = true;
    app.setData({ listItems: items });
    return;
  }

  if (event.target.getAttribute("data-action") === "confirmDelete") {
    var items = app.getData().listItems;
    items.splice(getListIndex(event), 1);
    app.setData({ listItems: items });
    return;
  }

  if (event.target.getAttribute("data-action") === "cancelDelete") {
    var items = app.getData().listItems;
    items[getListIndex(event)].confirmDelete = false;
    app.setData({ listItems: items });
    return;
  }
};

document.addEventListener("submit", submitHandler, false);
document.addEventListener("click", clickHandler, false);
document.addEventListener("render", saveChanges, false);

sortList(app.data.listItems);
loadSavedList();
app.render();
