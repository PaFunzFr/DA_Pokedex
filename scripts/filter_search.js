
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

function scaleClickedButton(event) {
    let button = event.target;
    if (button.style.width === "36px") {
        styleTypeButton(button, "", "");
    } else {
        styleTypeButton(button, "36px", "3px solid rgb(243, 243, 245)");
    }
}

function styleTypeButton(element, size, border) {
    element.style.width = size;
    element.style.height = size;
    element.style.border = border;
}

function showFilterButtons() {
    const filterConainter = document.getElementById("filterContainer");
    const filterButton = document.getElementById("filterButton");
    if (!filterButtonClicked) {
        styleButton(filterConainter,filterButton, "1", "60px", "#204081");
        filterButtonClicked = true;
    } else {
        styleButton(filterConainter,filterButton, "", "", "");
        filterButtonClicked = false;
        activeFilters = [];
        resetFilter();
        renderFilterButtons(allPokemonInfos);
    };
}

function styleButton(container, button, opacity, margin, color) {
    container.style.opacity = opacity;
    container.style.bottom = margin;
    button.style.backgroundColor = color;
}