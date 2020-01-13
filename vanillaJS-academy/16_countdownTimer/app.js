(function() {
  var app = document.querySelector("#app");

  // Statebased UI:
  // 1. A data object
  // 2. A template for showing how the UI should look based on different states
  // 3. A function to render the template in the DOM

  var data = {
    seconds: 5
  };

  var ticker = function() {
    // Decrease seconds by 1 every second
    data.seconds--;
    render();
  };
  var countdown = window.setInterval(ticker, 1000);

  var stopCountdown = function() {
    window.clearInterval(countdown);
  };

  var countdownUI = function() {
    // display number of seconds
    var html;

    if (data.seconds === 0) {
      stopCountdown();
      return "<div>⏰</div>" + "<button id='restart'>Restart</button>";
    }

    return "<div>" + data.seconds + "<span> secs</span></div>";
  };

  document.addEventListener(
    "click",
    function(event) {
      if (!event.target.id === "restart") return;
      console.log("clicked!");
      data.seconds = 5;
      countdown = window.setInterval(ticker, 1000);
      render();
    },
    false
  );

  var render = function() {
    // render countdownUI
    app.innerHTML = countdownUI();
  };

  render();
})();
