/**
 * Opens the modal for displaying detailed information about a specific Pokemon.
 * 
 * @param {number} pokemonId - The ID of the selected Pokemon.
 * @param {Array} arrayInfos - The array of information about all Pokemon.
 * @param {Array} arraySpecies - The array of species information for all Pokemon.
 * @param {string} renderedFor - A label to specify who the Pokémon cards are being rendered for (search or common data-array).
 */
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

/**
 * Calculates the width of a stat bar based on the Pokemon's stat value.
 * 
 * @param {number} value - The stat value (e.g., HP, attack).
 * @returns {number} - The calculated width of the stat bar in pixels.
 */
function calculateBarWidth(value) {
    const maxWidth = 200;
    const maxStatValue = 255;
    const percentage = (value / maxStatValue) * 100;
    return (percentage / 100) * maxWidth;
}

/**
 * Plays the cry (sound) of a Pokemon based on its ID.
 * 
 * @param {number} id - The ID of the Pokemon whose cry should be played.
 * @returns {Promise<void>} - A promise that resolves once the cry is played.
 */
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

/**
 * Fetches the evolution chain data for a specific Pokemon species.
 * 
 * @param {Object} arraySpecies - The species data containing the evolution chain URL.
 * @returns {Promise<Object|null>} - A promise that resolves with the evolution chain data or null if there's an error.
 */
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

/**
 * Formats a number with a comma separating the last digit for display (e.g., 10 becomes "1,0").
 * 
 * @param {number} number - The number to format.
 * @returns {string} - The formatted number as a string with a comma.
 */
function formatAttribute(number) {
    let numberStr = number.toString();
    if (number >= 10) {
        return numberStr.slice(0, -1) + ',' + numberStr.slice(-1);
    } else {
        return '0,' + numberStr;
    }
}

/**
 * Checks if the Pokemon is the first in the list and disables the previous button.
 * 
 * @param {number} index - The index of the current Pokemon in the list.
 */
function checkForFirstModalPokemon(index) {
    if (index === 0) {
        document.getElementById('prevPok').innerText = "";
    }
}

/**
 * Closes the modal when the user clicks outside the modal content area.
 * 
 * @param {Event} event - The event triggered by a user click.
 */
function closeModal(event) {
    if (event.target.id === "pokemonDetailModal") {
        pokemonDetailModal.style.display = "none";
        enableScroll();
    }
}

/**
 * Closes the modal when the close button is clicked.
 */
function closeModalBtn() {
    pokemonDetailModal.style.display = "none";
    enableScroll();
}

/**
 * Displays general statistics for the given Pokemon index and rendering context.
 * 
 * @param {number} index - The index of the selected Pokemon.
 * @param {string} renderedFor - A label to specify who the Pokémon cards are being rendered for (search or common data-array).
 */
function showStats(index, renderedFor) {
    let infoSource = getInfoSourceIndex(index, renderedFor);
    let speciesSource = getSpeciesSourceIndex(index, renderedFor);
    showGeneralStats(infoSource, speciesSource);
}

/**
 * Displays the statistics modal for a given Pokemon index based on the clicked element.
 * 
 * @param {Event} event - The event triggered by the user clicking on an element.
 * @param {number} index - The index of the selected Pokemon.
 */
function showStatsModal(event, index) {
    const whatDataToRender = event.target.id;
    let infoSource = getInfoSourceIndex(index, whatDataToRender);
    let speciesSource = getSpeciesSourceIndex(index, whatDataToRender);
    showGeneralStats(infoSource, speciesSource);
}

/**
 * Displays the statistics modal for a given Pokemon index based on the clicked element.
 * 
 * @param {Event} event - The event triggered by the user clicking on an element.
 * @param {number} index - The index of the selected Pokemon.
 */
function showAttributes(event, index) {
    const whatDataToRender = event.target.id;
    let infoSource = getInfoSourceIndex(index, whatDataToRender);
    renderGraphAttributes(infoSource);
}

/**
 * Displays the evolution chain for a given Pokemon index based on the clicked element.
 * 
 * @param {Event} event - The event triggered by the user clicking on an element.
 * @param {number} index - The index of the selected Pokemon.
 */
function showEvolutionChain(event, index) {
    const whatDataToRender = event.target.id;
    let speciesSource = getSpeciesSourceIndex(index, whatDataToRender);
    renderEvolutionChain(speciesSource);
}

/**
 * Displays the forms for a given Pokemon index based on the clicked element.
 * 
 * @param {Event} event - The event triggered by the user clicking on an element.
 * @param {number} index - The index of the selected Pokemon.
 */
function showForms(event, index) {
    const whatDataToRender = event.target.id;
    let infoSource = getInfoSourceIndex(index, whatDataToRender);
    renderForms(infoSource);
}

/**
 * Retrieves the source of the Pokemon data based on the context of what data should be rendered.
 * 
 * @param {string} whatDataToRender - The context for rendering (e.g., "common", "searched").
 * @returns {Array} - The array of Pokemon data to be used.
 */
function getInfoSource(whatDataToRender) {
    let pokStats = whatDataToRender.includes("common") ? 
        allPokemonInfos : searchedPokemonInfos;
    return pokStats;
}

/**
 * Retrieves the source of the Pokemon data for a specific index based on the context of what data should be rendered.
 * 
 * @param {number} index - The index of the selected Pokemon.
 * @param {string} whatDataToRender - The context for rendering (e.g., "common", "searched").
 * @returns {Object} - The Pokemon data object for the given index.
 */
function getInfoSourceIndex(index, whatDataToRender) {
    let pokStats = whatDataToRender.includes("common") ? 
        allPokemonInfos[index] : searchedPokemonInfos[index];
    return pokStats;
}

/**
 * Retrieves the source of the Pokemon species data based on the context of what data should be rendered.
 * 
 * @param {string} whatDataToRender - The context for rendering (e.g., "common", "searched").
 * @returns {Array} - The array of Pokemon species data to be used.
 */
function getSpeciesSource(whatDataToRender) {
    let pokStats = whatDataToRender.includes("common") ? 
        allPokemonSpecies: searchedPokemonSpecies;
    return pokStats;
}

/**
 * Retrieves the source of the Pokemon species data for a specific index based on the context of what data should be rendered.
 * 
 * @param {number} index - The index of the selected Pokemon.
 * @param {string} whatDataToRender - The context for rendering (e.g., "common", "searched").
 * @returns {Object} - The Pokemon species data object for the given index.
 */
function getSpeciesSourceIndex(index, whatDataToRender) {
    let pokStats = whatDataToRender.includes("common") ? 
        allPokemonSpecies[index] : searchedPokemonSpecies[index];
    return pokStats;
}


/**
 * Handles the event of navigating to the next Pokemon and renders its data.
 * 
 * @param {Event} event - The event triggered by the user clicking on the "next" button.
 * @param {number} index - The current index of the Pokemon.
 */
function nextPok(event, index) {
    const whatDataToRender = event.target.id;
    const renderedFor = whatDataToRender.split("-")[1].replace(/\d+$/, "");
    let infoSource = getInfoSource(whatDataToRender);
    let speciesSource= getSpeciesSource(whatDataToRender);
    renderNextPok(index, infoSource, speciesSource, renderedFor);
}

/**
 * Handles the event of navigating to the previous Pokemon and renders its data.
 * 
 * @param {Event} event - The event triggered by the user clicking on the "previous" button.
 * @param {number} index - The current index of the Pokemon.
 */
function prevPok(event, index) {
    const whatDataToRender = event.target.id;
    const renderedFor = whatDataToRender.split("-")[1].replace(/\d+$/, "");
    let infoSource = getInfoSource(whatDataToRender);
    let speciesSource= getSpeciesSource(whatDataToRender);
    renderPrevPok(index, infoSource, speciesSource, renderedFor);
}

/**
 * Renders the next Pokemon's data and opens the modal for it.
 * If there are no more Pokemon in the current list, it loads more Pokemon.
 * 
 * @param {number} index - The current index of the Pokemon.
 * @param {Array} infoSource - The array of information about all Pokemon.
 * @param {Array} speciesSource - The array of species information for all Pokemon.
 * @param {string} renderedFor - A label to specify who the Pokémon cards are being rendered for (search or common data-array).
 * @returns {Promise<void>} - A promise that resolves once the next Pokemon's data is rendered.
 */
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

/**
 * Renders the previous Pokemon's data and opens the modal for it.
 * Decreases the index to show the previous Pokemon if not at the beginning of the list.
 * 
 * @param {number} index - The current index of the Pokemon.
 * @param {Array} infoSource - The array of information about all Pokemon.
 * @param {Array} speciesSource - The array of species information for all Pokemon.
 * @param {string} renderedFor - A label to specify who the Pokémon cards are being rendered for (search or common data-array).
 * @returns {Promise<void>} - A promise that resolves once the previous Pokemon's data is rendered.
 */
async function renderPrevPok(index, infoSource, speciesSource, renderedFor) {
    if (index > 0) { 
        index--;
        openModal(index, infoSource, speciesSource, renderedFor);
    }
}

/**
 * Hides the "Next" button if the current index is the last one in the list.
 * The button's text is cleared if the last Pokemon in the searched data is reached.
 * 
 * @param {number} index - The current index of the Pokemon.
 * @param {Array} infoSource - The array of information about all Pokemon.
 * @param {string} renderedFor - A label to specify who the Pokémon cards are being rendered for (search or common data-array).
 */
function hideNextButtonIfLast(index, infoSource, renderedFor) {
    if (renderedFor === "searchedData") {
        const nextButton = document.getElementById(`nxt-${renderedFor}${index}`);
        if (index >= infoSource.length - 1 && nextButton) {
            nextButton.innerText = "";
        }
    }
}

/**
 * Hides the "Previous" button if the current index is the first one in the list.
 * The button's text is cleared if the first Pokemon is displayed.
 * 
 * @param {number} index - The current index of the Pokemon.
 * @param {string} renderedFor - A label to specify who the Pokémon cards are being rendered for (search or common data-array).
 */
function hidePrevButtonIfFirst(index, renderedFor) {
    const prevButton = document.getElementById(`pre-${renderedFor}${index}`);
    if (index === 0 && prevButton) {
        prevButton.innerText = "";
    }
}

/**
 * Hides both the "Next" and "Previous" buttons if a filter is active.
 * The buttons' text is cleared when the filter is applied.
 */
function hideAllButtonIfFilterActive() {
    const nextButton = document.querySelector('.nextPok') || null;
    const prevButton = document.querySelector('.prevPok') || null;;
    if (filterActive) {
        nextButton.innerText = '';
        prevButton.innerText = '';
    }
}
