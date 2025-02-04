let currentShownPokemon = 30;
let allPokemonData = [];
let selectedPokemon = null;

const pokemonContainer = document.getElementById("pokemon-container");
const loadButton = document.getElementById("load-button");
const pokemonDetailModal = document.getElementById("pokemon-detail-modal");
const pokemonDetailContent = document.getElementById("pokemon-details");
const closeModalButton = document.getElementById("close-modal");
const nextPokemonButton = document.getElementById("next-pokemon");
const prevPokemonButton = document.getElementById("prev-pokemon");

async function fetchPokemonData(limit, offset) {
  try {
    const getPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const pokemonData = await getPokemon.json();
    console.log(getPokemon);
    pokemonData.results.forEach(pokemon => allPokemonData.push(pokemon));
    renderPokemonCards(pokemonData.results);
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon:", error);
  }
}

async function renderPokemonCards(pokemonList) {
  for (pokemon of pokemonList) {
    const card = document.createElement("div");
    const pokemonId = pokemon.url.split("/")[6];
    const pokemonInfos = await pokemonDetails(pokemonId);
    card.classList.add("pokemon-card");
    console.log(pokemonInfos.types);
    card.dataset.name = pokemon.name;
    card.innerHTML = `
      <h3>${pokemon.name}</h3>
      <p>#${pokemonId}
      <img class="main-pic" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png" alt="${pokemon.name}">
      <p>${pokemonInfos.types.map(types => `<button class="type-button">${types.type.name}</button>`).join("")}</p>
      <p>Location: Platzhalter</p>
    `;
    card.addEventListener("click", () => showPokemonDetails(pokemon.name));
    pokemonContainer.appendChild(card);
  };
}


async function pokemonDetails(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonInfos = await response.json();
    return pokemonInfos;
  } catch (error) {
    
  }
}

async function showPokemonDetails(pokemonName) {
  const pokemon = allPokemonData.find(p => p.name === pokemonName);
  selectedPokemon = pokemon;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    
    pokemonDetailContent.innerHTML = `
      <h2>${data.name}</h2>
      <div id="general-properties">
        <h3>Allgemeine Eigenschaften</h3>
        <p>HP: ${data.stats[0].base_stat}</p>
        <p>EP: ${data.stats[1].base_stat}</p>
      </div>
      <div id="evolution">
        <h3>Entwicklungsstufen</h3>
        <p>Entwicklungskette: Platzhalter</p>
      </div>
      <div id="regions">
        <h3>Vorkommen in Regionen</h3>
        <p>Regionen: Platzhalter</p>
      </div>
    `;
    
    pokemonDetailModal.style.display = "flex";
  } catch (error) {
    console.error("Fehler beim Laden der Detaildaten:", error);
  }
}

function closePokemonDetail() {
  pokemonDetailModal.style.display = "none";
}

nextPokemonButton.addEventListener("click", () => {
  const currentIndex = allPokemonData.indexOf(selectedPokemon);
  const nextPokemon = allPokemonData[currentIndex + 1];
  if (nextPokemon) {
    showPokemonDetails(nextPokemon.name);
  }
});

prevPokemonButton.addEventListener("click", () => {
  const currentIndex = allPokemonData.indexOf(selectedPokemon);
  const prevPokemon = allPokemonData[currentIndex - 1];
  if (prevPokemon) {
    showPokemonDetails(prevPokemon.name);
  }
});

closeModalButton.addEventListener("click", closePokemonDetail);

loadButton.addEventListener("click", () => {
  fetchPokemonData(30, currentShownPokemon);
  currentShownPokemon += 30;
});


