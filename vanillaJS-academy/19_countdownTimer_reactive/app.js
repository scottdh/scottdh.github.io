(function() {
  var app = document.querySelector("#app");
  var duration = 5;
  // Statebased UI:
  // 1. A data object
  // 2. A template for showing how the UI should look based on different states
  // 3. A function to render the template in the DOM

  // A data object.
  //Possible statuses are "default", "counting", "paused" and "done"
  var data = {
    seconds: duration,
    status: "default"
  };

  // Reactively update the data object
  var setData = function(obj) {
    // Update the data object
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        data[key] = obj[key];
      }
    }
    // Render a new UI
    render();
  };

  var getData = function() {
    return JSON.parse(JSON.stringify(data));
  };

  var stopTimer = function() {
    window.clearInterval(countdown);
  };

  var startTimer = function() {
    // Tick the timer down and update the UI every second
    countdown = window.setInterval(function() {
      if (data.status === "counting") {
        var count = data.seconds - 1;
        setData({ seconds: count });
        if (data.seconds === 0) {
          setData({ status: "done" });
          stopTimer();
        }
      }
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

    var minutes = parseInt(data.seconds / 60, 10);
    var seconds = data.seconds % 60;

    html =
      data.status === "done"
        ? "⏱ <button id='reset'>Reset</button>"
        : minutes.toString() + ":" + seconds.toString().padStart(2, "0");
    if (data.status === "default") {
      html += "<button id='pauseStart'>Start</button>";
    } else if (data.status === "counting") {
      html +=
        "<div><button id='reset'>Reset</button><button id='pauseStart'>Pause</button></div>";
    } else if (data.status === "paused") {
      html +=
        "<div><button id='reset'>Reset</button><button id='pauseStart'>Resume</button></div>";
    }
    return html;
  };

  var render = function() {
    if (countdownUI() === app.innerHTML) return;
    // render countdownUI
    app.innerHTML = countdownUI();
  };

  // Click event delegation
  window.addEventListener(
    "click",
    function(event) {
      // When pauseStart is clicked: change data.status to appropriate value, Update UI for new status and start or stop timer.
      if (event.target.matches("#pauseStart")) {
        if (data.status === "default" || data.status === "paused") {
          setData({ status: "counting" });
          startTimer();
        } else if (data.status === "counting") {
          setData({ status: "paused" });
          stopTimer();
        }
        return;
      }

      // When reset is clicked, change data.status to default, data.seconds to duration, update UI and stop timer.
      if (event.target.matches("#reset")) {
        setData({ status: "default", seconds: duration });
        stopTimer();
        return;
      }
    },
    false
  );

  render();
})();
