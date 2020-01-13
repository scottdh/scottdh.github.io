(function() {
  var app = document.querySelector("#app");
  var duration = 5;
  // Statebased UI:
  // 1. A data object
  // 2. A template for showing how the UI should look based on different states
  // 3. A function to render the template in the DOM

  // A data object
  var data = {
    seconds: duration
  };

  var startTimer = function() {
    // Reset the data object
    data.seconds = duration;

    render();

    // Tick the timer down and update the UI every second
    countdown = window.setInterval(function() {
      data.seconds--;

      if (data.seconds === 0) {
        window.clearInterval(countdown);
      }

      render();
    }, 1000);
  };

  // var timeString = function(seconds) {
  //   dateObj = new Date(data.seconds * 1000);
  //   minutes = dateObj.getUTCMinutes();
  //   seconds = dateObj.getSeconds();

  //   return (
  //     minutes.toString().padStart(2, "0") +
  //     ":" +
  //     seconds.toString().padStart(2, "0")
  //   );
  // };

  // Template
  var countdownUI = function() {
    // display number of seconds

    if (data.seconds === 0) {
      return "<div>⏰</div>" + "<button id='restart'>Restart</button>";
    }

    var minutes = parseInt(data.seconds / 60, 10);
    var moo = data.seconds % 60;

    return minutes.toString() + ":" + moo.toString().padStart(2, "0");
    // return '<div id="countdown">' + timeString(data.seconds) + "</div>";
  };

  var render = function() {
    // render countdownUI
    app.innerHTML = countdownUI();
  };

  startTimer();

  window.addEventListener(
    "click",
    function(event) {
      if (!event.target.matches("#restart")) return;
      console.log("clicked!");
      startTimer();
      render();
    },
    false
  );
})();
