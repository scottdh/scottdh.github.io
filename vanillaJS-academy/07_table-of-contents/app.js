var tableOfContents = document.querySelector("#table-of-contents");

var h2s = Array.prototype.slice.call(document.querySelectorAll("h2"));

h2s.forEach(function(header) {
  if (!header.hasAttribute("id")) {
    var id = header.textContent.replace(/\s/g, "-").toLowerCase();
    header.id = id;
  }
});

if (h2s.length > 0) {
  tableOfContents.innerHTML =
    "<h2>Table of Contents</h2>" +
    "<ol>" +
    h2s
      .map(function(heading) {
        var html = `
      <li>
      	<a href="#${heading.id}">${heading.textContent}</a>
      </li>
        `;
        return html;
      })
      .join("") +
    "</ol>";
}
