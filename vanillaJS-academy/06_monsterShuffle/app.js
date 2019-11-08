// The monsters and socks

var app = document.querySelector("#app");

var monsters = [
  {
    name: "monster1",
    image: "monster1.svg",
    alt: "Aww. Cute, yellow monster with a curly nose"
  },
  {
    name: "monster2",
    image: "monster2.svg",
    alt: "Urgh. Happy yellow cyclops monster"
  },
  {
    name: "monster3",
    image: "monster3.svg",
    alt: "Oh no! Scary green fly-trap monster"
  },
  {
    name: "monster4",
    image: "monster4.svg",
    alt: "Hmm. Four armed, no-legged red monster"
  },
  {
    name: "monster5",
    image: "monster5.svg",
    alt: "Aww. Melancholic green spherical cyclops monster"
  },
  {
    name: "monster6",
    image: "monster6.svg",
    alt: "RUN! It's a scary upside down triangle monster!"
  },
  {
    name: "monster7",
    image: "monster7.svg",
    alt: "Oops. It's a two-tentacled, one-eyed octopus monster"
  },
  {
    name: "monster8",
    image: "monster8.svg",
    alt: "Chill. It's a purple bouncing hopper monster"
  },
  {
    name: "monster9",
    image: "monster9.svg",
    alt: "Oh oh! It's a blue uddered flying ant monster"
  },
  {
    name: "monster10",
    image: "monster10.svg",
    alt: "Oh no! It's a blue blob monster"
  },
  {
    name: "monster11",
    image: "monster11.svg",
    alt: "Aww. It's a black grizzly monster."
  },
  {
    name: "Sock",
    image: "sock.svg",
    alt: "OH FOR FUCK SAKE! You found the sock."
  }
];

var shuffle = function(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// shuffle(monsters);

var renderShuffledMonsters = monsters
  .map(function(monster, index) {
    var html = `
    <div class="cell">
        <button data-monsterID="${index}">
            <img src="door.svg" alt="Click the door to see what's behind it" />
        </button>
    </div>`;
    return html;
  })
  .join("");

var revealMonster = event => {
  var monster = event.target.closest("[data-monsterID]");
  if (!monster) return;

  var id = monster.getAttribute("data-monsterID");

  monster.parentNode.innerHTML = `<img src="${monsters[id].image}" alt="${monsters[id].alt}"/>`;
};

app.innerHTML =
  '<div class="grid" aria-live="assertive">' +
  renderShuffledMonsters +
  "</div>";

window.addEventListener("click", revealMonster, false);
