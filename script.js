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
let resetButtton = document.getElementById("resetBtn");

async function init() {
    showSpinner();
    await fetchPokemonData(30, 0);
    await getPokemonInfos(allPokemonData, allPokemonInfos, allPokemonSpecies);
    renderPokemonCards(0, allPokemonData, allPokemonInfos, allPokemonSpecies, renderedForData);
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
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error("Error while loading Poke API", error);
    }
}

async function fetchPokemonSpecies(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error("Error while loading Poke API", error);
    }
}

// currently not used
async function fetchPokemonEncounters(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`);
        const responseAsJson = await response.json();
        return responseAsJson;
    } catch (error) {
        console.error("Error while loading Poke API", error);
    }
}

window.addEventListener("scroll", async () => {
    if (!isLoadingEnabled) return; 
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        isLoadingEnabled = false;
        await loadMorePokemon();
        isLoadingEnabled = true;
    }
});

function disableLoadOnScroll() {
    isLoadingEnabled = false;
}

// Funktion zum Aktivieren der Scroll-Funktion
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

function openModal(pokemonId, arrayData, arrayInfos, arraySpecies, renderedFor) {
    selectedPokemon = pokemonId;
    console.log(`du hast Pokemon ${arrayData[0].name} ausgewählt`);
    renderModal(selectedPokemon, arrayInfos, arraySpecies, renderedFor);
    checkForFirstModalPokemon(selectedPokemon);
    showStats(pokemonId, renderedFor);
    pokemonDetailModal.style.display ="flex";
    disableScroll();
}

function calculateBarWidth(value) {
    const maxWidth = 200;
    const maxStatValue = 255;
    const percentage = (value / maxStatValue) * 100;
    return (percentage / 100) * maxWidth;
}

async function playCry(index) {
    try {
        let pokIndex = index + 1;
        let response = await fetch(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokIndex}.ogg`);
        let audioUrl = URL.createObjectURL(await response.blob());
        let audio = new Audio(audioUrl);
        audio.volume = 0.5;
        audio.play();
    } catch (error) {
        console.log(error.message);
    }
}


function isPokemonLegendary(index, arraySpecies) {
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

async function fetchEvolutionChain(arraySpecies) {
    try {
        const evolutionUrl = arraySpecies.evolution_chain.url;
        const response = await fetch(`${evolutionUrl}`);
        const responseAsJson = await response.json();
        if (!responseAsJson || !responseAsJson.chain) {
            console.error("no evolution existing");
            return null;
        }
        return responseAsJson;
    } catch (error) {
        console.error("Error while loading Poke API", error);
        return null;
    }
}

function formatAttribute(number) {
    let numberStr = number.toString();
    if (number >= 10) {
        return numberStr.slice(0, -1) + ',' + numberStr.slice(-1);
    } else {
        return '0,' + numberStr;
    }
}

function formatPokemonId(id) {
    return id.toString().padStart(4, '0');
}

function formattingFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

async function nextPok() {
    resetSearch();
    if (selectedPokemon < allPokemonInfos.length - 1) {
        selectedPokemon++;
        openModal(selectedPokemon +1);
    } else if (selectedPokemon => allPokemonInfos.length -1) {
        await loadMorePokemon();
        selectedPokemon++;
        openModal(selectedPokemon +1);
        setTimeout(() => {
            disableScroll();
        }, 400);
    }
}

async function prevPok() {
    resetSearch();
    if (selectedPokemon > 0) { 
        selectedPokemon--;
        openModal(selectedPokemon + 1);
    }
}

function checkForFirstModalPokemon(index) {
    if (index === 0) {
        document.getElementById('prevPok').innerText = "";
    }
}

function closeModal(event) {
    if (event.target.id === "pokemonDetailModal") {
        pokemonDetailModal.style.display = "none";
        enableScroll();
    }
}

function closeModalBtn() {
    pokemonDetailModal.style.display = "none";
    enableScroll();
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

async function searchAllPokemon() {
    disableLoadOnScroll();
    resetAllSearchArrays ();
    isSearching = true;
    const partialName = document.getElementById("searchBar").value.toLowerCase();
    checkSearchInput(partialName);
    try {
        await fetchSearchedPokemon(partialName);
        await getPokemonInfos(searchedPokemonData, searchedPokemonInfos, searchedPokemonSpecies);
        renderPokemonCards(0, searchedPokemonData, searchedPokemonInfos, searchedPokemonSpecies, renderedForSearch);
        let allCommonCards = document.querySelectorAll(`.pokemon-card[data-name='${renderedForData}']`);
        allCommonCards.forEach(card => {
            card.style.display = "none";
        });
        setTimeout(() => {
            isSearching = false;
        }, 500);
        document.getElementById("searchBar").value = "";
    } catch (error) {
        console.error("Fehler:", error.message);
    }
}

function resetSearch() {
    resetButtton.style.display = "none";
    resetAllSearchArrays ();
    let cards = document.querySelectorAll(`.pokemon-card[data-name='${renderedForData}']`);
    cards.forEach(card => {
        card.style.display = "block";
    });
    enableLoadOnScroll();
}

function checkSearchInput(input) {
    if (input.length < 3) {
        return;
    }
    resetButtton.style.display = "flex";
}

async function fetchSearchedPokemon(partialName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    const data = await response.json();
    const filtered = data.results.filter(pokemon => pokemon.name.includes(partialName));
    filtered.forEach(pokemon => {
        pushIfLimitIsntReached(allPokemonToLoad, pokemon, searchedPokemonData);
    });
}

function resetAllSearchArrays () {
    searchedPokemonData = [];
    searchedPokemonInfos = [];
    searchedPokemonSpecies = [];
    let allSearchedCards = document.querySelectorAll(`.pokemon-card[data-name='${renderedForSearch}']`);
    allSearchedCards.forEach(card => {
        card.remove();
    });
}

//assisting render functions
function showStats(index, renderedFor) {
    let infoSource = checkInfoSource(index, renderedFor);
    let speciesSource = checkSpeciesSource(index, renderedFor);
    showGeneralStats(infoSource, speciesSource);
}

function showStatsModal(event, index) {
    const whatDataToRender = event.target.id;
    let infoSource = checkInfoSource(index, whatDataToRender);
    let speciesSource = checkSpeciesSource(index, whatDataToRender);
    showGeneralStats(infoSource, speciesSource);
}

function showAttributes(event, index) {
    const whatDataToRender = event.target.id;
    let infoSource = checkInfoSource(index, whatDataToRender);
    renderGraphAttributes(infoSource);
}

function showEvolutionChain(event, index) {
    const whatDataToRender = event.target.id;
    let speciesSource = checkSpeciesSource(index, whatDataToRender);
    renderEvolutionChain(speciesSource);
}

function showForms(event, index) {
    const whatDataToRender = event.target.id;
    let infoSource = checkInfoSource(index, whatDataToRender);
    renderForms(infoSource);
}

function checkInfoSource(index, whatDataToRender) {
    let pokStats;
    if (whatDataToRender.includes("common")) {
        pokStats = allPokemonInfos[index];
    } else if (whatDataToRender.includes("searched")) {
        pokStats = searchedPokemonInfos[index];
    }
    return pokStats;
}

function checkSpeciesSource(index, whatDataToRender) {
    let pokStats;
    if (whatDataToRender.includes("common")) {
        pokStats = allPokemonSpecies[index];
    } else if (whatDataToRender.includes("searched")) {
        pokStats = searchedPokemonSpecies[index];
    }
    return pokStats;
}