// TO DO - what if there are no articles?

(function() {
  var APIurl = "https://vanillajsacademy.com/api/pirates.json";
  var storageID = "scuttlebutt";
  var saved = JSON.parse(localStorage.getItem(storageID));
  var goodFor = 1000 * 10; // 1 min
  var app = document.querySelector("#app");

  var sanitizeHTML = function(str) {
    var temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  };

  var getEndpoint = function() {
    var endpoint = "https://vanillajsacademy.com/api/";
    var random = Math.random();
    // return "moo";
    if (random < 0.5) {
      console.log(endpoint + "pirates.json");
      return endpoint + "pirates.json";
    } else {
      console.log(endpoint + "fail.json");
      return endpoint + "fail.json";
    }
  };

  // Check for data in localstorage.
  var checkInLocalStorage = function(saved, goodFor) {
    // Check that there's data, and a timestamp key. If not, fetch new data.
    if (!saved || !saved.data || !saved.timestamp) {
      fetchNewData();
      console.log("There is no data - fetching new data");
    } else {
      // Get the difference between the timestamp and current time
      var dataIsFresh =
        new Date().getTime() - saved.timestamp < goodFor ? true : false;
      if (dataIsFresh) {
        console.log("Data is fresh - rendering articles from local storage");
        renderArticles(saved.data);
      } else {
        fetchNewData();
        console.log("Data is old - fetching new data");
      }
    }
  };

  // Setup the localStorage data
  var saveToLocalStorage = function(data) {
    var data = {
      data: data,
      timestamp: new Date().getTime()
    };
    // Save to localStorage
    localStorage.setItem(storageID, JSON.stringify(data));
  };

  // Fetch new data from the API
  var fetchNewData = function() {
    fetch(getEndpoint())
      .then(function(response) {
        // The API call was successful!
        if (response.ok) {
          console.log("response considered OK");
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then(function(data) {
        console.log("Got new data!");
        renderArticles(data);
        saveToLocalStorage(data);
      })
      .catch(function(err) {
        // There was an error
        handleError();
        console.warn("Something went wrong.", err);
      });
  };

  // Render Articles
  var renderArticles = function(data, fromCacheWarning) {
    var publication = data.publication;
    var tagline = data.tagline;
    var articles = data.articles;
    if (fromCacheWarning) {
      app.innerHTML =
        '<p class="warning"><strong>Watch out:</strong> We couldn\'t download the latest articles due to a connection error. Try refreshing the page later.</p>';
    } else {
      app.innerHTML = "";
    }

    app.innerHTML +=
      "<header>" +
      "<h1>" +
      sanitizeHTML(publication) +
      "</h1>" +
      "<p>" +
      sanitizeHTML(tagline) +
      "</p>" +
      "</header>" +
      articles
        .map(function(article) {
          html =
            "<article>" +
            "<h2>" +
            sanitizeHTML(article.title) +
            "</h2>" +
            "<p>" +
            sanitizeHTML(article.article) +
            "</p>" +
            "</article>";
          return html;
        })
        .join("");
  };

  checkInLocalStorage(saved, goodFor);

  var handleError = function() {
    if (!saved) {
      app.innerHTML = "Cannot connect to API";
    } else {
      var fromCacheWarning = true;
      renderArticles(saved.data, fromCacheWarning);
      console.log("API call failed. Loaded data from cache");
    }
  };
})();
