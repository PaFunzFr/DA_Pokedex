let currentShownPokemon = 30;
let allPokemonData = [];
let selectedPokemon = null;
let allPokemonInfos = [];
let allPokemonSpecies = [];
let loading = false;

const pokemonContainer = document.getElementById("pokemonContainer");
const loadButton = document.getElementById("loadButton");
const pokemonDetailModal = document.getElementById("pokemonDetailModal");
const pokemonDetailContent = document.getElementById("pokemonDetails");
const closeModalButton = document.getElementById("closeModal");
const nextPokemonButton = document.getElementById("nextPok");
const prevPokemonButton = document.getElementById("prevPok");

async function init() {
    document.getElementById("spinner").classList.remove("hidden");
    await fetchPokemonData(30, 0);
    await getPokemonInfos(allPokemonData);
    renderPokemonCards(0);
    document.getElementById("spinner").classList.add("hidden");
}

async function fetchPokemonData(limit, offset) {
    try {
        const getPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonData = await getPokemon.json();
        pokemonData.results.forEach(pokemon => {
            pushIfLimitIsntReached(1000, pokemon);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Pokémon:", error);
    }
} 

function pushIfLimitIsntReached(limit, pokemon) {
    if (allPokemonData.length < limit) {
        allPokemonData.push(pokemon)
    }
}

async function getPokemonInfos(pokemonList) {
    const fetchPromises = [];
    fetchAllData(pokemonList, fetchPromises);
    const results = await Promise.all(fetchPromises.map(promisePair => Promise.all(promisePair)));
    pushDataToArray(results);
    console.log(allPokemonInfos);
    console.log(allPokemonSpecies);
}

function fetchAllData(pokemonList, fetchPromises) {
    for (let i = 0; i < pokemonList.length; i++) {
        const pokemon = pokemonList[i];
        const pokemonId = extractPokemonId(pokemon.url);
        const pokemonInfos = fetchPokemonDetails(pokemonId);
        const pokemonSpecies = fetchPokemonSpecies(pokemonId);
        fetchPromises.push([pokemonInfos, pokemonSpecies]);
    }
}

function pushDataToArray(results) {
    for (let i = 0; i < results.length; i++) {
        const pokemonInfos = results[i][0];
        const pokemonSpecies = results[i][1];
        allPokemonInfos.push(pokemonInfos);
        allPokemonSpecies.push(pokemonSpecies);
    }
}

function extractPokemonId(url) {
    return url.split("/")[6];
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

window.addEventListener("scroll", async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        await loadMorePokemon();
    }
});

async function loadMorePokemon() {
    if (loading || allPokemonData.length >= 1000) return;
    loading = true;
    disableScroll();
    document.getElementById("spinner").classList.remove("hidden");
    await fetchPokemonData(30, currentShownPokemon);
    await getPokemonInfos(allPokemonData.slice(currentShownPokemon, currentShownPokemon + 30));
    setTimeout(() => {
        renderPokemonCards(currentShownPokemon);
        currentShownPokemon += 30;
        document.getElementById("spinner").classList.add("hidden");
        enableScroll();
    }, 400);
    loading = false;
}

function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '17px';
}

function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}