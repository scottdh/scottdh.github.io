// TO DO - what if there are no articles?

(function() {
  var APIurl = "https://vanillajsacademy.com/api/pirates.json";
  var storageID = "scuttlebutt";
  var saved = JSON.parse(localStorage.getItem(storageID));
  var goodFor = 1000 * 10; // 10 secs
  var app = document.querySelector("#app");

  var sanitizeHTML = function(str) {
    var temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
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
    fetch(APIurl)
      .then(function(response) {
        // The API call was successful!
        if (response.ok) {
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
        console.warn("Something went wrong.", err);
      });
  };

  // Render Articles
  var renderArticles = function(data) {
    var publication = data.publication;
    var tagline = data.tagline;
    var articles = data.articles;

    app.innerHTML =
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
})();
