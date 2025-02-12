
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
