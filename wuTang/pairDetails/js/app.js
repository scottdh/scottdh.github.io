// var bookmark = document.querySelector("#bookmark");
var additionalInfoRight = document.querySelector("#additionalRight");
var additionalInfoLeft = document.querySelector("#additionalLeft");

// bookmark.addEventListener(
//   "mouseover",
//   function() {
//     // if (!e.target === compareBox) return;
//     additionalInfoRight.classList.add("right");
//     additionalInfoLeft.classList.add("left");
//   },
//   false
// );

// bookmark.addEventListener(
//   "mouseout",
//   function() {
//     additionalInfoRight.classList.remove("right");
//     additionalInfoLeft.classList.remove("left");
//   },
//   false
// );

// window.addEventListener()

var group = document.querySelector("#bookmark");
var nodes = document.querySelectorAll(".box");
var total = nodes.length;
var ease = Power1.easeInOut;
var boxes = [];

for (var i = 0; i < total; i++) {
  var node = nodes[i];

  // Initialize transforms on node
  TweenLite.set(node, { x: 0 });

  boxes[i] = {
    transform: node._gsTransform,
    x: node.offsetLeft,
    y: node.offsetTop,
    node
  };
}

bookmark.addEventListener("mouseenter", layout);
bookmark.addEventListener("mouseleave", layout);

function layout() {
  console.log("moo");
  additionalInfoLeft.classList.toggle("reorder");
  additionalInfoRight.classList.toggle("reorder");
  additionalInfoLeft.classList.toggle("left");
  additionalInfoRight.classList.toggle("right");

  for (var i = 0; i < total; i++) {
    var box = boxes[i];

    var lastX = box.x;
    var lastY = box.y;

    box.x = box.node.offsetLeft;
    box.y = box.node.offsetTop;

    // Continue if box hasn't moved
    if (lastX === box.x && lastY === box.y) continue;

    // Reversed delta values taking into account current transforms
    var x = box.transform.x + lastX - box.x;
    var y = box.transform.y + lastY - box.y;

    // Tween to 0 to remove the transforms
    TweenLite.fromTo(box.node, 0.5, { x, y }, { x: 0, y: 0, ease });
  }
}
