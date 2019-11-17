var city;
var region;
var app = document.querySelector("#app");

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
    var key = "67b5fab1a3d24296933a9fc1b91cbf5d";
    city = data.city;
    region = data.region;
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
    var temp = weatherData.data[0].temp;
    var icon = weatherData.data[0].weather.icon;
    var todaysDate = new Date();
    var time = weatherData.data[0].ob_time.substring(10, 16);
    var day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      todaysDate
    );
    var sunriseTime = weatherData.data[0].sunrise;
    var sunsetTime = weatherData.data[0].sunset;
    var windSpeed = weatherData.data[0].wind_spd;

    html = `
    <h2>${city}, ${region}</h2>
    <p>${day} ${time}</p>
    <img src="./icons/${icon}.png"/>
    <p id="temp">${temp}&#8451</p>
    <div id="additionalInfo">
        <div class="sunrise">
            <img src="./icons/sunrise.png" />
            <p class="label">Sunrise</p>
            <p class="info">${sunriseTime}</p>
        </div>
        <div class="wind">
            <img src="./icons/wind.png" />
            <p class="label">Wind</p>
            <p class="info">${windSpeed} m/s</p>
        </div>
        <div class="sunset">
            <img src="./icons/sunset.png" />
            <p class="label">Sunset</p>
            <p class="info">${sunsetTime}</p>
        </div>
    </div>
    
    
    `;

    app.innerHTML = html;
  })
  .catch(function(error) {
    console.warn(error);
  });
