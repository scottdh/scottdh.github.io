/**
 * Sanitize and encode all HTML in a user-submitted string
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
var sanitizeHTML = function(str) {
  var temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
};

var app = document.querySelector("#app");

var nyAPI =
  "https://api.nytimes.com/svc/topstories/v2/[sectionName].json?api-key=fGMG4NoLeq8HRPppmGXzMsNvzSiAyuC9";

var sections = ["books", "fashion", "science", "movies"];
var numberOfArticles = 4;

var createArticlePreviews = function(section, articles) {
  app.innerHTML +=
    "<h2>" +
    section +
    "</h2>" +
    articles
      .map(function(article) {
        var html = `
<a class="articlePreview" href="${sanitizeHTML(article.short_url)}">
  <h3>${sanitizeHTML(article.title)}</h3>
  <p>${sanitizeHTML(article.abstract)}</p>
  <p class="byline">${sanitizeHTML(article.byline)}</p>
  <p class="sectionName">${sanitizeHTML(article.section)}</p>
</a>`;
        return html;
      })
      .join("");
};

sections.forEach(function(section) {
  fetch(nyAPI.replace("[sectionName]", section))
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(function(data) {
      // Slice off just the number of articles wanted from the response.
      var articleArr = data.results.slice(0, numberOfArticles);
      // Render the articles into a list of article previews
      createArticlePreviews(section, articleArr);
    })
    .catch(function(err) {
      console.warn("Something went wrong " + err);
    });
});
