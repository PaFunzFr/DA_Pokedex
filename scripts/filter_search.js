/**
 * Handles the click event of the search button.
 * Retrieves the search input, converts it to lowercase, 
 * and initiates a search if the input length is sufficient.
 */
function clickedSearcButton() {
    const partialName = document.getElementById("searchBar").value.toLowerCase();
    if (checkIfInputLegit(partialName)) {
        return;
    } else {
        searchAllPokemons(partialName);
    }
}

/**
 * Searches for all Pokémon matching the partial name input.
 * Disables scroll loading, resets search arrays, and fetches Pokémon data.
 * @param {string} partialName - The partial name to search for.
 */
async function searchAllPokemons(partialName) {
    disableLoadOnScroll();
    resetAllSearchArrays();
    filterDataName = "searchedData";
    isSearching = true;
    try {
        await getAllSearchedData(partialName);
        hideAllCommonCardsAndResetBar();
    } catch (error) {
        console.error("Error:", error.message);
    }
    renderFilterButtons(searchedPokemonInfos);
}

/**
 * Hides all the Pokémon cards that are common and resets the search bar.
 * Resets the search state after a brief delay.
 */
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

/**
 * Retrieves and processes the data for the searched Pokémon based on the partial name.
 * @param {string} partialName - The partial name to search for.
 */
async function getAllSearchedData(partialName) {
    await fetchSearchedPokemon(partialName);
    await getPokemonInfos(searchedPokemonData, searchedPokemonInfos, searchedPokemonSpecies);
    renderPokemonCards(0, searchedPokemonData, searchedPokemonInfos, searchedPokemonSpecies, renderedForSearch);
}

/**
 * Resets the state of the search, showing all Pokémon cards again and enabling scroll loading.
 */
function resetSearch() {
    resetButtton.style.display = "none";
    resetAllSearchArrays();
    let cards = document.querySelectorAll(`.pokemon-card[data-name='${renderedForData}']`);
    cards.forEach(card => {
        card.style.display = "block";
    });
    enableLoadOnScroll();
    renderFilterButtons(allPokemonInfos);
    filterActive = false;
}

/**
 * Validates the search input to ensure it is at least 3 characters long.
 * @param {string} input - The input to be validated.
 * @returns {boolean} - True if input is too short, otherwise false.
 */
function checkIfInputLegit(input) {
    if (input.length < 3) {
        console.log("Minimum input length: 3 letters");
        return true;
    }
    resetButtton.style.display = "flex";
    return false;
}

/**
 * Fetches the data for Pokémon that match the partial name.
 * Filters the Pokémon by name and adds them to the loadable Pokémon data.
 * @param {string} partialName - The partial name to search for.
 */
async function fetchSearchedPokemon(partialName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    const data = await response.json();
    const filtered = data.results.filter(pokemon => pokemon.name.includes(partialName));
    filtered.forEach(pokemon => {
        pushIfLimitIsntReached(allPokemonToLoad, pokemon, searchedPokemonData);
    });
}

/**
 * Resets all search-related arrays and removes any displayed Pokémon cards for searched data.
 */
function resetAllSearchArrays() {
    searchedPokemonData = [];
    searchedPokemonInfos = [];
    searchedPokemonSpecies = [];
    let allSearchedCards = document.querySelectorAll(`.pokemon-card[data-name='${renderedForSearch}']`);
    allSearchedCards.forEach(card => {
        card.remove();
    });
}

/**
 * Handles the filter button click event.
 * Disables scroll loading and applies the selected filter.
 * @param {Event} event - The event object for the filter button click.
 */
function filterButton(event) {
    disableLoadOnScroll();
    const filteredType = event.target.id.split("-")[1];
    useFilter(filteredType);
}

/**
 * Applies the selected filter to the displayed Pokémon cards.
 * @param {string} filteredType - The type of filter to be applied.
 */
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

/**
 * Hides all Pokémon cards and only shows the ones that match the active filters.
 */
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

/**
 * Resets the filter settings, displaying all Pokémon cards and resetting the search state.
 */
function resetFilter() {
    let allCardsArray = Array.from(document.querySelectorAll('.pokemon-card'));
    allCardsArray.forEach(card => card.style.display = 'block');
    enableLoadOnScroll();
    resetAllSearchArrays();
    resetSearch();
    filterActive = false;
    filterDataName = "commonData";
}

/**
 * Toggles the size and border of the clicked filter button.
 * @param {Event} event - The event object for the filter button click.
 */
function scaleClickedButton(event) {
    let button = event.target;
    if (button.style.width === "36px") {
        styleTypeButton(button, "", "");
    } else {
        styleTypeButton(button, "36px", "3px solid rgb(243, 243, 245)");
    }
}

/**
 * Styles the filter button by adjusting its width, height, and border.
 * @param {HTMLElement} element - The button element to style.
 * @param {string} size - The desired size of the button (width and height).
 * @param {string} border - The border style for the button.
 */
function styleTypeButton(element, size, border) {
    element.style.width = size;
    element.style.height = size;
    element.style.border = border;
}

/**
 * Shows or hides the filter buttons, and toggles the filter container's visibility.
 */
function showFilterButtons() {
    const filterConainter = document.getElementById("filterContainer");
    const filterButton = document.getElementById("filterButton");
    if (!filterButtonClicked) {
        styleButton(filterConainter, filterButton, "1", "60px", "#204081");
        filterButtonClicked = true;
    } else {
        styleButton(filterConainter, filterButton, "", "", "");
        filterButtonClicked = false;
        activeFilters = [];
        resetFilter();
        renderFilterButtons(allPokemonInfos);
    }
}

/**
 * Styles the filter container and button with specific opacity, margin, and color.
 * @param {HTMLElement} container - The filter container element.
 * @param {HTMLElement} button - The filter button element.
 * @param {string} opacity - The opacity of the container.
 * @param {string} margin - The margin for the button.
 * @param {string} color - The background color for the button.
 */
function styleButton(container, button, opacity, margin, color) {
    container.style.opacity = opacity;
    container.style.bottom = margin;
    button.style.backgroundColor = color;
}
