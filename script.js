let currentShownPokemon = 30;
let allPokemonData = [];
let searchedPokemonData = [];
let allPokemonInfos = [];
let searchedPokemonInfos = [];
let allPokemonSpecies = [];
let searchedPokemonSpecies = [];
let selectedPokemon = null;
let loading = false;
let isSearching = false;
let isLoadingEnabled = false;
let filterActive = false;
let activeFilters = [];
let filterDataName = "commonData";
let filterButtonClicked = false;

const allPokemonToLoad = 1025;
const renderedForData = "commonData";
const renderedForSearch = "searchedData";

const pokemonContainer = document.getElementById("pokemonContainer");
const loadButton = document.getElementById("loadButton");
const pokemonDetailModal = document.getElementById("pokemonDetailModal");
const pokemonDetailContent = document.getElementById("pokemonDetails");
const closeModalButton = document.getElementById("closeModal");
const nextPokemonButton = document.getElementById("nextPok");
const prevPokemonButton = document.getElementById("prevPok");
const resetButtton = document.getElementById("resetBtn");

async function init() {
    showSpinner();
    await fetchPokemonData(30, 0);
    await getPokemonInfos(allPokemonData, allPokemonInfos, allPokemonSpecies);
    renderPokemonCards(0, allPokemonData, allPokemonInfos, allPokemonSpecies, renderedForData);
    renderFilterButtons(allPokemonInfos);
    hideSpinner();
    enableScroll();
    enableLoadOnScroll();
}

async function fetchPokemonData(limit, offset) {
    try {
        const getPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonData = await getPokemon.json();
        pokemonData.results.forEach(pokemon => {
            pushIfLimitIsntReached(allPokemonToLoad, pokemon, allPokemonData);
        });
    } catch (error) {
        console.error("Error while loading Poke API", error);
    }
} 

function pushIfLimitIsntReached(limit, pokemon, arrayData) {
    if (arrayData.length < limit) {
        arrayData.push(pokemon)
    }
}

async function getPokemonInfos(pokemonList, arrayInfos, arraySpecies) {
    const fetchPromises = [];
    fetchAllData(pokemonList, fetchPromises);
    const results = await Promise.all(fetchPromises.map(entries => Promise.all(entries)));
    pushDataToArray(results, arrayInfos, arraySpecies);
    console.log(arrayInfos);
    console.log(arraySpecies);
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

function pushDataToArray(results, arrayInfo, arraySpecies) {
    for (let i = 0; i < results.length; i++) {
        const pokemonInfos = results[i][0];
        const pokemonSpecies = results[i][1];
        arrayInfo.push(pokemonInfos);
        arraySpecies.push(pokemonSpecies);
    }
}

function extractPokemonId(url) {
    return url.split("/")[6];
}

async function fetchPokemonDetails(pokemonId) {
    return await fetchDataByUrl(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
}

async function fetchPokemonSpecies(pokemonId) {
    return await fetchDataByUrl(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
}

async function fetchDataByUrl(url) {
    try {
        const response = await fetch(url);
        const responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error("Error while loading Poke API", error);
    }
}

// scroll event
window.addEventListener("scroll", async () => {
    if (!isLoadingEnabled) return; 
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        isLoadingEnabled = false;
        await loadMorePokemon();
        renderFilterButtons(allPokemonInfos);
        isLoadingEnabled = true;
    }
});

function disableLoadOnScroll() {
    isLoadingEnabled = false;
}

function enableLoadOnScroll() {
    isLoadingEnabled = true;
}

async function loadMorePokemon() {
    if (loading || allPokemonData.length >= allPokemonToLoad || isSearching) return;
    loading = true;
    showSpinner();
    await fetchPokemonData(30, currentShownPokemon);
    await getPokemonInfos(
        allPokemonData.slice(currentShownPokemon, currentShownPokemon + 30),
        allPokemonInfos,
        allPokemonSpecies);
    renderNewCards();
    loading = false;
}

function showSpinner() {
    disableScroll();
    document.getElementById("spinner").classList.remove("hidden");
}

function hideSpinner() {
        setTimeout(() => {
        document.getElementById("spinner").classList.add("hidden");
        enableScroll();
    }, 400);
}

function renderNewCards() {
    renderPokemonCards(currentShownPokemon, allPokemonData, allPokemonInfos, allPokemonSpecies, renderedForData);
    currentShownPokemon += 30;
    hideSpinner();
}

function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '17px';
}

function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

function isPokemonLegendary(index, arraySpecies) {
    if (!arraySpecies || !arraySpecies[index]) {
        console.error(`Fehler: arraySpecies[${index}] ist undefined.`, arraySpecies);
        return "common";
    }
    if (arraySpecies[index].is_legendary || arraySpecies[index].is_mythical) {
        return "legendary";
    } else {
        return "common";
    }
}

function isPokemonLegendaryTitle(index, arraySpecies) {
    if (arraySpecies[index].is_legendary || arraySpecies[index].is_mythical) {
        return "legendary-name";
    } else {
        return "common";
    }
}

function formatPokemonId(id) {
    return id.toString().padStart(4, '0');
}

function formattingFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

window.addEventListener("scroll", () => {
    let shadow = document.querySelector(".shadow-top");
    let scrollPosition = window.scrollY;
    if (scrollPosition > 90) {
        shadow.style.height = "200px";
    } else {
        shadow.style.height = "80px";
    }
});