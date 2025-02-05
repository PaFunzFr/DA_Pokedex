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

async function init() {
    await fetchPokemonData(30, 0);
    getPokemonInfos();
}

async function fetchPokemonData(limit, offset) {
    try {
        const getPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonData = await getPokemon.json();
        //console.log(pokemonData);
        pokemonData.results.forEach(pokemon => allPokemonData.push(pokemon));

    } catch (error) {
        console.error("Fehler beim Laden der Pokémon:", error);
    }
} 


async function getPokemonInfos() {
    for (pokemon of allPokemonData) {
        const pokemonId = extractPokemonId(pokemon.url);
        const pokemonInfos = await fetchPokemonDetails(pokemonId);
        //console.log(pokemonInfos.types);
        //console.log(pokemon);
        renderPokemonCards(pokemon, pokemonInfos, pokemonId);
        };
}

function extractPokemonId(url) {
    return url.split("/")[6];
}

function renderPokemonCards(pokemon, pokemonInfos, pokemonId) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.dataset.name = pokemon.name;
    card.innerHTML = `
    <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    <p>#${pokemonId}
    <img class="main-pic" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png" alt="${pokemon.name}">
    <p>${pokemonInfos.types.map(types => `<button class="type-button">${types.type.name}</button>`).join("")}</p>
    <p>Location: Platzhalter</p>
    `;
    //card.addEventListener("click", () => showPokemonDetails(pokemon.name));
    pokemonContainer.appendChild(card);
}

async function fetchPokemonDetails(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonInfos = await response.json();
        //console.log(await pokemonInfos);
        return pokemonInfos;
    } catch (error) {
        
    }
}

async function fetchPokemonDetails2(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const pokemonInfos = await response.json();
        console.log(await pokemonInfos.evolution_chain.url);
        return pokemonInfos;
    } catch (error) {
        
    }
}