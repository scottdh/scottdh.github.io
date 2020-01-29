var field_newToDo = document.querySelector("#new-todo");
var btn_addToDo = document.querySelector("button");
var localStorageID = "toDoAppData";
var app, field;

var sortList = function(arr) {
  arr.sort(function(a, b) {
    return a.done - b.done;
  });
};

var getListIndex = function(event) {
  if (event.target.id === "add-list") {
    console.log("MOOO");
    return;
  }
  return event.target.closest("li").getAttribute("data-listIndex");
};

var getParams = function(url) {
  var params = {};
  var parser = document.createElement("a");
  parser.href = url ? url : window.location.href;
  var query = parser.search.substring(1);
  var vars = query.split("&");
  if (vars.length < 1 || vars[0].length < 1) return params;
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return params;
};

var createTodos = function() {
  app = new Reef("#app", {
    data: {},
    template: function(props) {
      var link =
        '<a href="' +
        window.location.href.replace("?list=" + props.current, "") +
        '">&larr; Back to Lists</a>';

      var list = props.lists[props.current];

      if (!list) {
        return (
          link +
          "<h1>List not found</h1>" +
          "<p>The list seems to be missing. Please return to the lists</p>"
        );
      }

      var form =
        link +
        "<h1>" +
        list.name +
        "</h1>" +
        '<form id="add-todos">' +
        '<label for="new-todo">What do you want to do?</label>' +
        '<input type="text" id="new-todo" autofocus>' +
        "<button>Add Todo</button>" +
        "</form>";

      // If there are no todos, ask the user to add some
      if (list.todos.length < 1) {
        return (
          form +
          "<p>You don't have any todos yet. Add some using the form above.</p>"
        );
      }

      // Generate markup for todo items
      return (
        form +
        '<ul class="todos">' +
        list.todos
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
};

var createLists = function() {
  app = new Reef("#app", {
    data: {},
    template: function(props) {
      var form =
        "<h1>My Lists</h1>" +
        "<form id='add-list'>" +
        "<label for='new-list'>Create a list</label>" +
        "<input type='text' id='new-list' autofocus />" +
        "<button>Create list</button>" +
        "</form>";

      // If there are no lists, ask the user to add some
      if (props.lists.length < 1) {
        return (
          form +
          "<p>You don't have any lists yet. Add one using the form above.</p>"
        );
      }
      // Generate markup for lists
      return (
        form +
        '<ol class="lists">' +
        props.lists
          .map(function(list, index) {
            // Create list item
            var listHTML =
              "<li " +
              "data-listIndex='" +
              index +
              "'>" +
              "<div><a href='?list=" +
              index +
              "'>" +
              list.name +
              "(" +
              list.todos.length +
              ")" +
              "</a></div>";

            if (props.lists[index].confirmDelete) {
              // Show the cancel and confirm delete buttons
              listHTML +=
                "<div>Sure? <button data-action='cancelDelete'>Cancel</button><button class='destructive' data-action='confirmDelete' >Yup, delete</button></div>";
            } else {
              // show the delete button
              listHTML +=
                "<div><button data-action='delete'>Delete</button></div>";
            }
            listHTML += "</li>";

            return listHTML;
          })
          .join("") +
        "</ol>"
      );
    }
  });
};

// Copied

var saveChanges = function() {
  localStorage.setItem(localStorageID, JSON.stringify(app.getData()));
};

var loadSavedList = function(list) {
  var savedList = localStorage.getItem(localStorageID);

  // Check if any list items have been saved to local storage
  var data = savedList
    ? JSON.parse(savedList)
    : {
        lists: [{ name: "Default List", todos: [] }]
      };
  data.current = list ? parseInt(list, 10) : null;

  // Update the state and run an initial render
  app.setData(data);
};

/**
 * Setup the UI
 */
var setup = function() {
  // Get the list ID from the URL if there is one
  var list = getParams().list;
  console.log(list);
  // If there's a list ID, create the todos view
  // Otherwise, create the lists view
  if (list) {
    createTodos();
  } else {
    createLists();
  }

  // Render the initial UI
  loadSavedList(list);

  // define field for submit
  field = document.querySelector("#new-list, #new-todo");
};

var addTodo = function(event) {
  if (event.target.id !== "add-todos") return;
  event.preventDefault();

  if (field.value.length < 1) return;

  // Get a copy of the data
  var data = app.getData();

  // Get the current list
  var list = data.lists[data.current];
  if (!list) return;

  list.todos.push({ item: field.value, done: false });

  app.setData({ lists: data.lists });

  // Clear the field and return focus
  field.value = "";
  field.focus();

  return;
};

var addList = function(event) {
  if (event.target.id !== "add-list") return;
  event.preventDefault();

  if (field.value.length < 1) return;

  console.log("Add list event fires " + field);

  // Get a copy of the lists
  var lists = app.getData().lists;

  // Add the new list
  lists.push({
    name: field.value,
    todos: []
  });

  // Render fresh UI
  app.setData({ lists: lists });
};

var submitHandler = function(event) {
  addList(event);
  addTodo(event);
};

var clickHandler = function(event) {
  if (event.target.matches("[type='checkbox']")) {
    // Undo default (un)checking behaviour of checkbox. This is because, after sort, whichever item has replaced the checked item in list order also gets checked. Weeeird.
    // event.target.checked = event.target.checked ? false : true;
    var data = app.getData();
    var currentTodo = data.lists[data.current]["todos"][getListIndex(event)];
    currentTodo.done = currentTodo.done === false ? true : false;
    sortList(data.lists[data.current]["todos"]);
    app.setData({ lists: data.lists });
    return;
  }

  if (event.target.getAttribute("data-action") === "delete") {
    var data = app.getData();
    if (event.target.closest("ol")) {
      var list = data.lists[getListIndex(event)];
      list.confirmDelete = true;
      app.setData({ lists: data.lists });
      return;
    }

    if (event.target.closest("ul")) {
      var currentTodo = data.lists[data.current]["todos"][getListIndex(event)];
      currentTodo.confirmDelete = true;
      app.setData({ lists: data.lists });
      return;
    }
  }

  if (event.target.getAttribute("data-action") === "confirmDelete") {
    var data = app.getData();
    if (event.target.closest("ol")) {
      var list = data.lists.splice([getListIndex(event)], 1);
      app.setData({ lists: data.lists });
      return;
    }
    data.lists[data.current]["todos"].splice(getListIndex(event), 1);
    app.setData({ lists: data.lists });
  }

  if (event.target.getAttribute("data-action") === "cancelDelete") {
    var data = app.getData();
    if (event.target.closest("ol")) {
      var list = data.lists[getListIndex(event)];
      list.confirmDelete = false;
      app.setData({ lists: data.lists });
      return;
    }
    var currentTodo = data.lists[data.current]["todos"][getListIndex(event)];
    currentTodo.confirmDelete = false;
    app.setData({ lists: data.lists });
    return;
  }
  return;
};

document.addEventListener("submit", submitHandler, false);
document.addEventListener("click", clickHandler, false);
document.addEventListener("render", saveChanges, false);

// sortList(app.data.listItems);
// loadSavedList();
// app.render();
setup();
