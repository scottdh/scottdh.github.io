var getWeather = function(options) {
  var key = "67b5fab1a3d24296933a9fc1b91cbf5d";

  // Helper functions
  var cToF = function(temp) {
    return (parseFloat(temp) * 9) / 5 + 32;
  };

  var sanitizeHTML = function(str) {
    var temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  };

  var defaults = {
    selector: "#app",
    showImage: true,
    convertToFahrenheit: true,
    showSunrise: true,
    showWind: true,
    showSunset: true
  };

  var settings = Object.assign(defaults, options);

  var app = document.querySelector(settings.selector);

  var renderWeather = function(weatherData) {
    var temp = sanitizeHTML(weatherData.data[0].temp);
    var icon = sanitizeHTML(weatherData.data[0].weather.icon);
    var day = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(
      new Date()
    );
    var time = sanitizeHTML(weatherData.data[0].ob_time).substring(10, 16);
    var sunriseTime = sanitizeHTML(weatherData.data[0].sunrise);
    var sunsetTime = sanitizeHTML(weatherData.data[0].sunset);
    var windSpeed = sanitizeHTML(weatherData.data[0].wind_spd);
    var city = sanitizeHTML(weatherData.data[0].city_name);
    var region = sanitizeHTML(weatherData.data[0].state_code);

    var wind = `
      <div class="wind">
        <img src="./icons/wind.png" />
        <p class="label">Wind</p>
        <p class="info">${windSpeed} m/s</p>
      </div>`;

    var sunset = `
      <div class="sunset">
        <img src="./icons/sunset.png" />
        <p class="label">Sunset</p>
        <p class="info">${sunsetTime}</p>
      </div>`;

    var sunrise = `
      <div class="sunRise">
        <img src="./icons/sunrise.png" />
        <p class="label">Sunrise</p>
        <p class="info">${sunriseTime}</p>
      </div>`;

    var image = `<img src="./icons/${icon}.png" />`;

    var showInfo = function(info, toggle) {
      var html;
      toggle ? (html = info) : (html = "");
      return html;
    };

    var getTemp = function(temp, toggle) {
      var convertedTemp;
      toggle
        ? (convertedTemp = cToF(temp) + "&#8457")
        : (convertedTemp = temp + "&#8451");
      return convertedTemp;
    };

    html = `
      <h2>${city}, ${region}</h2>
      <p>${day} ${time}</p>
      ${showInfo(image, settings.showImage)}
      <p id="temp">${getTemp(temp, settings.convertToFahrenheit)}</p>
      <div id="additionalInfo">
        ${showInfo(sunrise, settings.showSunrise)}
        ${showInfo(wind, settings.showWind)}
        ${showInfo(sunset, settings.showSunset)} 
      </div>
      `;
    app.innerHTML = html;
  };

  // Call the API
  fetch("https://ipapi.co/json")
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(function(data) {
      // Store the post data to a variable
      console.log(data);

      var weatherBitURL = "https://api.weatherbit.io/v2.0/current";
      var latitude = data.latitude;
      var longitude = data.longitude;

      return fetch(
        weatherBitURL + "?lat=" + latitude + "&lon=" + longitude + "&key=" + key
      );
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(function(weatherData) {
      console.log(weatherData.data[0]);
      renderWeather(weatherData);
    })
    .catch(function(error) {
      console.warn(error);
    });
};

getWeather({
  selector: "#app",
  showImage: true,
  convertToFahrenheit: false,
  showSunrise: true,
  showWind: true,
  showSunset: true
});
