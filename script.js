/**
 * The number of Pokémon currently displayed.
 * @type {number}
 */
let currentShownPokemon = 30;

/**
 * The total number of Pokémon to load.
 * @type {number}
 */
const allPokemonToLoad = 1025;

/**
 * Arrays storing all fetched Pokémon data.
 * @type {Array}
 */
let allPokemonData = [];
let searchedPokemonData = [];
let allPokemonInfos = [];
let searchedPokemonInfos = [];
let allPokemonSpecies = [];
let searchedPokemonSpecies = [];

/**
 * The currently selected Pokémon.
 * @type {Object|null}
 */
let selectedPokemon = null;

/**
 * global Booleans.
 * @type {boolean}
 */
let loading = false;
let isSearching = false;
let isLoadingEnabled = false;
let filterActive = false;
let filterButtonClicked = false;

/**
 * Array storing active filter criteria.
 * @type {Array}
 */
let activeFilters = [];

/**
 * The name of the data set currently used for filtering.
 * @type {string}
 */
let filterDataName = "commonData";

/**
 * The datasets used for rendering general & searched Pokémon data.
 * @type {string}
 */
const renderedForData = "commonData";
const renderedForSearch = "searchedData";


// DOM Elements
const pokemonContainer = document.getElementById("pokemonContainer");
const loadButton = document.getElementById("loadButton");
const pokemonDetailModal = document.getElementById("pokemonDetailModal");
const pokemonDetailContent = document.getElementById("pokemonDetails");
const closeModalButton = document.getElementById("closeModal");
const nextPokemonButton = document.getElementById("nextPok");
const prevPokemonButton = document.getElementById("prevPok");
const resetButtton = document.getElementById("resetBtn");

/**
 * Initializes the Pokémon application.
 * Fetches Pokémon data, renders initial Pokémon cards, and sets up event listeners.
 * @async
 * @returns {Promise<void>}
 */
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

/**
 * Fetches Pokémon data from the API and stores it in `allPokemonData`.
 * @async
 * @param {number} limit - The number of Pokémon to fetch.
 * @param {number} offset - The offset for pagination.
 * @returns {Promise<void>}
 */
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

/**
 * Adds a Pokémon to the given array if the limit is not reached.
 * @param {number} limit - The maximum number of Pokémon allowed.
 * @param {Object} pokemon - The Pokémon object to add.
 * @param {Array} arrayData - The array to store Pokémon data.
 */
function pushIfLimitIsntReached(limit, pokemon, arrayData) {
    if (arrayData.length < limit) {
        arrayData.push(pokemon);
    }
}

/**
 * Fetches detailed information and species data for a list of Pokémon.
 * @async
 * @param {Array} pokemonList - The list of Pokémon to fetch data for.
 * @param {Array} arrayInfos - The array to store detailed Pokémon information.
 * @param {Array} arraySpecies - The array to store Pokémon species data.
 * @returns {Promise<void>}
 */
async function getPokemonInfos(pokemonList, arrayInfos, arraySpecies) {
    const fetchPromises = [];
    fetchAllData(pokemonList, fetchPromises);
    const results = await Promise.all(fetchPromises.map(entries => Promise.all(entries)));
    pushDataToArray(results, arrayInfos, arraySpecies);
    console.log(arrayInfos);
    console.log(arraySpecies);
}

/**
 * Collects API fetch promises for Pokémon details and species data.
 * @param {Array} pokemonList - The list of Pokémon to fetch.
 * @param {Array} fetchPromises - The array storing fetch promises.
 */
function fetchAllData(pokemonList, fetchPromises) {
    for (let i = 0; i < pokemonList.length; i++) {
        const pokemon = pokemonList[i];
        const pokemonId = extractPokemonId(pokemon.url);
        const pokemonInfos = fetchPokemonDetails(pokemonId);
        const pokemonSpecies = fetchPokemonSpecies(pokemonId);
        fetchPromises.push([pokemonInfos, pokemonSpecies]);
    }
}

/**
 * Pushes fetched Pokémon data into the provided arrays.
 * @param {Array} results - The fetched data results.
 * @param {Array} arrayInfo - The array to store Pokémon details.
 * @param {Array} arraySpecies - The array to store Pokémon species data.
 */
function pushDataToArray(results, arrayInfo, arraySpecies) {
    for (let i = 0; i < results.length; i++) {
        const pokemonInfos = results[i][0];
        const pokemonSpecies = results[i][1];
        arrayInfo.push(pokemonInfos);
        arraySpecies.push(pokemonSpecies);
    }
}

/**
 * Extracts the Pokémon ID from a given API URL.
 * @param {string} url - The URL containing the Pokémon ID.
 * @returns {string} The extracted Pokémon ID.
 */
function extractPokemonId(url) {
    return url.split("/")[6];
}

/**
 * Fetches detailed information for a specific Pokémon.
 * @async
 * @param {string} pokemonId - The ID of the Pokémon.
 * @returns {Promise<Object>} The Pokémon details.
 */
async function fetchPokemonDetails(pokemonId) {
    return await fetchDataByUrl(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
}

/**
 * Fetches species data for a specific Pokémon.
 * @async
 * @param {string} pokemonId - The ID of the Pokémon.
 * @returns {Promise<Object>} The Pokémon species data.
 */
async function fetchPokemonSpecies(pokemonId) {
    return await fetchDataByUrl(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
}

/**
 * Fetches data from a given API URL.
 * @async
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} The fetched data.
 */
async function fetchDataByUrl(url) {
    try {
        const response = await fetch(url);
        const responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error("Error while loading Poke API", error);
    }
}
/**
 * Loads additional Pokémon if not already loading and conditions are met.
 * Fetches more Pokémon data and renders new Pokémon cards.
 * @async
 * @returns {Promise<void>}
 */
async function loadMorePokemon() {
    if (loading || allPokemonData.length >= allPokemonToLoad || isSearching) return;
    loading = true;
    showSpinner();
    await fetchPokemonData(30, currentShownPokemon);
    await getPokemonInfos(
        allPokemonData.slice(currentShownPokemon, currentShownPokemon + 30),
        allPokemonInfos,
        allPokemonSpecies
    );
    renderNewCards();
    loading = false;
}

/**
 * Displays the loading spinner and disables scrolling.
 */
function showSpinner() {
    disableScroll();
    document.getElementById("spinner").classList.remove("hidden");
}

/**
 * Hides the loading spinner after a short delay and enables scrolling.
 */
function hideSpinner() {
    setTimeout(() => {
        document.getElementById("spinner").classList.add("hidden");
        enableScroll();
    }, 400);
}

/**
 * Renders newly loaded Pokémon cards and updates the count of displayed Pokémon.
 */
function renderNewCards() {
    renderPokemonCards(currentShownPokemon, allPokemonData, allPokemonInfos, allPokemonSpecies, renderedForData);
    currentShownPokemon += 30;
    hideSpinner();
}

/**
 * Determines if a Pokémon is legendary or mythical.
 * @param {number} index - Index of the Pokémon in the species array.
 * @param {Array} arraySpecies - Array containing Pokémon species data source.
 * @returns {string} Returns "legendary" if the Pokémon is legendary or mythical, otherwise "common".
 */
function isPokemonLegendary(index, arraySpecies) {
    if (!arraySpecies || !arraySpecies[index]) {
        console.error(`Error: arraySpecies[${index}] is undefined.`, arraySpecies);
        return "common";
    }
    return arraySpecies[index].is_legendary || arraySpecies[index].is_mythical ? "legendary" : "common";
}

/**
 * Determines the title class for a Pokémon based on its legendary or mythical status.
 * @param {number} index - Index of the Pokémon in the species array.
 * @param {Array} arraySpecies - Array containing Pokémon species data source.
 * @returns {string} Returns "legendary-name" if the Pokémon is legendary or mythical, otherwise "common".
 */
function isPokemonLegendaryTitle(index, arraySpecies) {
    return arraySpecies[index].is_legendary || arraySpecies[index].is_mythical ? "legendary-name" : "common";
}

/**
 * Formats a Pokémon ID with leading zeros to always have four digits.
 * @param {number} id - The Pokémon ID.
 * @returns {string} The formatted ID as a four-digit string.
 */
function formatPokemonId(id) {
    return id.toString().padStart(4, '0');
}

/**
 * Capitalizes the first letter of a given word.
 * @param {string} word - The word to format.
 * @returns {string} The word with the first letter capitalized.
 */
function formattingFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
