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
let resetButtton = document.getElementById("resetBtn");

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

function openModal(pokemonId, arrayInfos, arraySpecies, renderedFor) {
    selectedPokemon = pokemonId;
    renderModal(selectedPokemon, arrayInfos, arraySpecies, renderedFor);
    hidePrevButtonIfFirst(pokemonId, renderedFor);
    hideNextButtonIfLast(pokemonId, arrayInfos, renderedFor);
    hideAllButtonIfFilterActive();
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

async function playCry(id) {
    try {
        let pokIndex = id;
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

function clickedSearcButton() {
    const partialName = document.getElementById("searchBar").value.toLowerCase();
    if (checkSearchInput(partialName)) {
        return
    } else {
        searchAllPokemons(partialName);
    };
}

async function searchAllPokemons(partialName) {
    disableLoadOnScroll();
    resetAllSearchArrays ();
    filterDataName = "searchedData";
    isSearching = true;
    try {
        await getAllSearchedData(partialName);
        hideAllCommonCardsAndResetBar();
    } catch (error) {
        console.error("Fehler:", error.message);
    }
    renderFilterButtons(searchedPokemonInfos);
} 

function hideAllCommonCardsAndResetBar() {
    let allCommonCards = document.querySelectorAll(`.pokemon-card[data-name='${renderedForData}']`);
    allCommonCards.forEach(card => {
        card.style.display = "none";
    });
    setTimeout(() => {
        isSearching = false;
    }, 500);
    document.getElementById("searchBar").value = "";
}

async function getAllSearchedData(partialName) {
    await fetchSearchedPokemon(partialName);
    await getPokemonInfos(searchedPokemonData, searchedPokemonInfos, searchedPokemonSpecies);
    renderPokemonCards(0, searchedPokemonData, searchedPokemonInfos, searchedPokemonSpecies, renderedForSearch);
}

function resetSearch() {
    resetButtton.style.display = "none";
    resetAllSearchArrays ();
    let cards = document.querySelectorAll(`.pokemon-card[data-name='${renderedForData}']`);
    cards.forEach(card => {
        card.style.display = "block";
    });
    enableLoadOnScroll();
    renderFilterButtons(allPokemonInfos);
    filterActive = false;
}

function checkSearchInput(input) {
    if (input.length < 3) {
        console.log("minimum input length: 3 letters");
        return true;
    }
    resetButtton.style.display = "flex";
    return false;
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
    let infoSource = getInfoSourceIndex(index, renderedFor);
    let speciesSource = getSpeciesSourceIndex(index, renderedFor);
    showGeneralStats(infoSource, speciesSource);
}

function showStatsModal(event, index) {
    const whatDataToRender = event.target.id;
    let infoSource = getInfoSourceIndex(index, whatDataToRender);
    let speciesSource = getSpeciesSourceIndex(index, whatDataToRender);
    showGeneralStats(infoSource, speciesSource);
}

function showAttributes(event, index) {
    const whatDataToRender = event.target.id;
    let infoSource = getInfoSourceIndex(index, whatDataToRender);
    renderGraphAttributes(infoSource);
}

function showEvolutionChain(event, index) {
    const whatDataToRender = event.target.id;
    let speciesSource = getSpeciesSourceIndex(index, whatDataToRender);
    renderEvolutionChain(speciesSource);
}

function showForms(event, index) {
    const whatDataToRender = event.target.id;
    let infoSource = getInfoSourceIndex(index, whatDataToRender);
    renderForms(infoSource);
}

function getInfoSource(whatDataToRender) {
    let pokStats = whatDataToRender.includes("common") ? 
        allPokemonInfos : searchedPokemonInfos;
    return pokStats;
}
function getInfoSourceIndex(index, whatDataToRender) {
    let pokStats = whatDataToRender.includes("common") ? 
        allPokemonInfos[index] : searchedPokemonInfos[index];
    return pokStats;
}

function getSpeciesSource(whatDataToRender) {
    let pokStats = whatDataToRender.includes("common") ? 
        allPokemonSpecies: searchedPokemonSpecies;
    return pokStats;
}

function getSpeciesSourceIndex(index, whatDataToRender) {
    let pokStats = whatDataToRender.includes("common") ? 
        allPokemonSpecies[index] : searchedPokemonSpecies[index];
    return pokStats;
}

// prevPok & nextPok
function nextPok(event, index) {
    const whatDataToRender = event.target.id;
    const renderedFor = whatDataToRender.split("-")[1].replace(/\d+$/, "");
    let infoSource = getInfoSource(whatDataToRender);
    let speciesSource= getSpeciesSource(whatDataToRender);
    renderNextPok(index, infoSource, speciesSource, renderedFor);
}

function prevPok(event, index) {
    const whatDataToRender = event.target.id;
    const renderedFor = whatDataToRender.split("-")[1].replace(/\d+$/, "");
    let infoSource = getInfoSource(whatDataToRender);
    let speciesSource= getSpeciesSource(whatDataToRender);
    renderPrevPok(index, infoSource, speciesSource, renderedFor);
}

async function renderNextPok(index, infoSource, speciesSource, renderedFor) {
    if (index < infoSource.length - 1) {
        index++;
        openModal(index, infoSource, speciesSource, renderedFor);
    } else if (index >= infoSource.length - 1) {
        if (renderedFor === "commonData") {
            await loadMorePokemon();
            index++;
            openModal(index, infoSource, speciesSource, renderedFor);
            setTimeout(disableScroll, 400);
        }
    }
}

async function renderPrevPok(index, infoSource, speciesSource, renderedFor) {
    if (index > 0) { 
        index--;
        openModal(index, infoSource, speciesSource, renderedFor);
    }
}

function hideNextButtonIfLast(index, infoSource, renderedFor) {
    console.log("triggered" + index);
    if (renderedFor === "searchedData") {
        const nextButton = document.getElementById(`nxt-${renderedFor}${index}`);
        if (index >= infoSource.length - 1 && nextButton) {
            nextButton.innerText = "";
        }
    }
}

function hidePrevButtonIfFirst(index, renderedFor) {
    const prevButton = document.getElementById(`pre-${renderedFor}${index}`);
    if (index === 0 && prevButton) {
        prevButton.innerText = "";
    }
}

function hideAllButtonIfFilterActive() {
    const nextButton = document.querySelector('.nextPok') || null;
    const prevButton = document.querySelector('.prevPok') || null;;
    if (filterActive) {
        nextButton.innerText = '';
        prevButton.innerText = '';
    }
}

// filter functions
function filterButton(event) {
    disableLoadOnScroll();
    const filteredType = event.target.id.split("-")[1];
    useFilter(filteredType);
}

function useFilter(filteredType) {
    if (activeFilters.includes(filteredType)) {
        activeFilters = activeFilters.filter(filter => filter !== filteredType);
        if (activeFilters.length === 0) {
            resetFilter();
            renderFilterButtons(allPokemonInfos);
            return;
        }
    } else {
        activeFilters.push(filteredType);
    }
    isolatePokemon();
}

function isolatePokemon() {
    filterActive = true;
    let allCards = Array.from(document.querySelectorAll('.pokemon-card'));
    allCards.forEach(card => card.style.display = 'none');
    activeFilters.forEach((type) => {
        let filteredCards = allCards.filter(card => 
            card.classList.contains(type) && card.getAttribute('data-name') === filterDataName
        );
        filteredCards.forEach(card => card.style.display = 'block');
    });
}

function resetFilter() {
    let allCardsArray = Array.from(document.querySelectorAll('.pokemon-card'));
    allCardsArray.forEach(card => card.style.display = 'block');
    enableLoadOnScroll();
    resetAllSearchArrays();
    resetSearch();
    filterActive = false;
    filterDataName = "commonData";
}

function renderFilterButtons(sourceArray) {
    let typeButtonContainer = document.getElementById("filterContainer");
    typeButtonContainer.innerHTML = "";
    let uniqueTypes = new Set();
    sourceArray.forEach((pokemon) => {
        if (pokemon.types && pokemon.types.length > 0) {
            let primaryType = pokemon.types[0].type.name;
            uniqueTypes.add(primaryType);
        }
    });

    uniqueTypes.forEach((type) => {
        typeButtonContainer.innerHTML += `
            <img 
                src="./assets/img/04_type_icons/blank/${type}.png" 
                class="filter-btn-type ${type}" id="filterButton-${type}" 
                onclick="filterButton(event), scaleClickedButton(event)"
            >
        `;
    });
}

function scaleClickedButton(event) {
    let button = event.target;
    if (button.style.width === "30px") {
        button.style.width = "";
        button.style.height = "";
        button.style.border = "";
    } else {
        button.style.width = "30px"; 
        button.style.height = "30px";
        button.style.border = "3px solid rgb(243, 243, 245)";
    }
}

function showFilterButtons() {
    const filterButton = document.getElementById("filterContainer");
    if (!filterButtonClicked) {
        filterButton.style.opacity = "1";
        filterButton.style.bottom = "55px";
        filterButtonClicked = true;
    } else {
        filterButton.style.opacity = "0";
        filterButton.style.bottom = "";
        filterButtonClicked = false;
        activeFilters = [];
        resetFilter();
        renderFilterButtons(allPokemonInfos);
    };
}

