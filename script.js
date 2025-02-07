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
    showSpinner();
    await fetchPokemonData(30, 0);
    await getPokemonInfos(allPokemonData);
    renderPokemonCards(0);
    hideSpinner();
}

async function fetchPokemonData(limit, offset) {
    try {
        const getPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonData = await getPokemon.json();
        pokemonData.results.forEach(pokemon => {
            pushIfLimitIsntReached(1000, pokemon);
        });
    } catch (error) {
        console.error("Error while loading Poke API", error);
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
    const results = await Promise.all(fetchPromises.map(entries => Promise.all(entries)));
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
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        await loadMorePokemon();
    }
});

async function loadMorePokemon() {
    if (loading || allPokemonData.length >= 1000) return;
    loading = true;

    showSpinner();
    await fetchPokemonData(30, currentShownPokemon);
    await getPokemonInfos(allPokemonData.slice(currentShownPokemon, currentShownPokemon + 30));
    renderDelayedCards();
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

function renderDelayedCards() {
        renderPokemonCards(currentShownPokemon);
        currentShownPokemon += 30;
        hideSpinner()
}

function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '17px';
}

function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

function openModal(pokemonId) {
    selectedPokemon = pokemonId -1;
    console.log(`du hast Pokemon ${allPokemonInfos[selectedPokemon].name} ausgewählt`);
    renderModal(selectedPokemon);
    showGeneralStats(selectedPokemon);
    pokemonDetailModal.style.display ="flex";
    disableScroll();
}

function calculateBarWidth(value) {
    const maxWidth = 200;
    const maxStatValue = 255;
    const percentage = (value / maxStatValue) * 100;
    return (percentage / 100) * maxWidth;
}

function playCry(index) {
    let cryUrl = allPokemonInfos[index].cries.latest;
    if (cryUrl) {
        let audio = new Audio(cryUrl);
        audio.volume = 0.5;
        audio.play();
    } else {
        console.log("no cry avaliable");
    }
}

function isPokemonLegendary(index) {
    if (allPokemonSpecies[index].is_legendary || allPokemonSpecies[index].is_mythical) {
        return "legendary";
    } else {
        return "common";
    }
}

function isPokemonLegendaryTitle(index) {
    if (allPokemonSpecies[index].is_legendary || allPokemonSpecies[index].is_mythical) {
        return "legendary-name";
    } else {
        return "common";
    }
}

async function fetchEvolutionChain(pokemonId) {
    try {
        const evolutionUrl = allPokemonSpecies[pokemonId].evolution_chain.url;
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