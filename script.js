let currentShownPokemon = 30;
let allPokemonData = [];
let selectedPokemon = null;
let allPokemonInfos = [];
let allPokemonSpecies = [];

const pokemonContainer = document.getElementById("pokemonContainer");
const loadButton = document.getElementById("loadButton");
const pokemonDetailModal = document.getElementById("pokemonDetailModal");
const pokemonDetailContent = document.getElementById("pokemonDetails");
const closeModalButton = document.getElementById("closeModal");
const nextPokemonButton = document.getElementById("nextPok");
const prevPokemonButton = document.getElementById("prevPok");

async function init() {
    await fetchPokemonData(30, 0);
    await getPokemonInfos(allPokemonData);
    renderPokemonCards(0);
}

async function fetchPokemonData(limit, offset) {
    try {
        const getPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonData = await getPokemon.json();
        pokemonData.results.forEach(pokemon => {
            if (allPokemonData.length < 1026) {
                allPokemonData.push(pokemon)           }
            });
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon:", error);
    }
} 

async function getPokemonInfos(pokemonList) {
    const fetchPromises = [];
    for (let i = 0; i < pokemonList.length; i++) {
        const pokemon = pokemonList[i];
        const pokemonId = extractPokemonId(pokemon.url);
        const pokemonInfos = fetchPokemonDetails(pokemonId);
        const pokemonSpecies = fetchPokemonSpecies(pokemonId);
        fetchPromises.push([pokemonInfos, pokemonSpecies]);
    }
    const results = await Promise.all(fetchPromises.map(promisePair => Promise.all(promisePair)));
    for (let i = 0; i < results.length; i++) {
        const pokemonInfos = results[i][0];
        const pokemonSpecies = results[i][1];
        allPokemonInfos.push(pokemonInfos);
        allPokemonSpecies.push(pokemonSpecies);
    }
    console.log(allPokemonInfos);
    console.log(allPokemonSpecies);
}

function extractPokemonId(url) {
    return url.split("/")[6];
}

function renderPokemonCards(offset) {
    for (let i = offset; i < allPokemonInfos.length; i++) {
        const pokemon = allPokemonInfos[i];
        const card = document.createElement("div");
        const imgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        card.classList.add("pokemon-card");
        card.classList.add(`${pokemon.types[0].type.name}`);
        card.dataset.name = pokemon.name;
        card.innerHTML += `
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <p>#${pokemon.id}</p>
            <img class="main-pic" src="${imgSrc}" alt="${pokemon.name}">
            <div class="types">${pokemon.types.map(types => `<div class="type-info ${types.type.name}">${types.type.name}</div>`).join("")}</div>
        `;
        pokemonContainer.appendChild(card);
    }
}

async function fetchPokemonDetails(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon-Details:", error);
    }
}

async function fetchPokemonSpecies(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon-Spezies-Details:", error);
    }
}

async function fetchPokemonEncounters(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`);
        const responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon-Spezies-Details:", error);
    }
}

loadButton.addEventListener("click", async () => {
    loadButton.disabled = true;
    await fetchPokemonData(30, currentShownPokemon);
    await getPokemonInfos(allPokemonData.slice(currentShownPokemon, currentShownPokemon + 30));
    renderPokemonCards(currentShownPokemon);
    currentShownPokemon += 30;
    loadButton.disabled = false;
});