var field_newToDo = document.querySelector("#new-todo");
var btn_addToDo = document.querySelector("button");

var sortList = function(arr) {
  arr.sort(function(a, b) {
    return a.done - b.done;
  });
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
          var todoHTML =
            "<li " +
            (todo.done ? 'class="todo-done"' : "") +
            ">" +
            '<label for="todo-' +
            index +
            '">' +
            '<input type="checkbox" id="todo-' +
            index +
            '" data-listIndex="' +
            index +
            '" ' +
            (todo.done ? "checked" : "") +
            ">" +
            todo.item +
            "</label>" +
            "</li>";

          return todoHTML;
        })
        .join("") +
      "</ul>"
    );
  }
});

document.addEventListener(
  "submit",
  function(event) {
    if (event.target.id !== "add-todos") return;
    event.preventDefault();

    if (field_newToDo.value.length < 1) return;

    var newItem = field_newToDo.value;
    var items = app.getData().listItems;
    items.push({ item: newItem, done: false });
    sortList(items);
    app.setData({ listItems: items });

    // Clear the field and return focus
    field_newToDo.value = "";
    field_newToDo.focus();
  },
  false
);

document.addEventListener(
  "change",
  function(event) {
    if (!event.target.matches("[type='checkbox']")) return;

    var listIndex = event.target.getAttribute("data-listIndex");

    // Undo default (un)checking behaviour of checkbox. This is because, after sort, whichever item has replaced the checked item in list order also gets checked. Weeeird.
    event.target.checked = event.target.checked ? false : true;

    var listItemsCopy = app.getData().listItems;
    listItemsCopy[listIndex].done =
      listItemsCopy[listIndex].done === false ? true : false;
    sortList(listItemsCopy);
    app.setData({ listItems: listItemsCopy }, listIndex);
  },
  false
);

sortList(app.data.listItems);
app.render();
