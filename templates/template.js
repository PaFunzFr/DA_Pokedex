/**
 * Renders the Pokémon cards for display on the page.
 * 
 * @param {number} offset The index at which to start rendering the Pokémon cards.
 * @param {Object[]} arrayData The data array containing Pokémon information.
 * @param {Object[]} arrayInfos The array containing detailed information about each Pokémon.
 * @param {Object[]} arraySpecies The array containing species-related information for each Pokémon.
 * @param {string} renderedFor A label to specify who the Pokémon cards are being rendered for (search or common data-array).
 */
function renderPokemonCards(offset, arrayData, arrayInfos, arraySpecies, renderedFor) {
    for (let i = offset; i < arrayData.length; i++) {
        const card = document.createElement("div");
        const imgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${arrayInfos[i].id}.png`;
        card.classList.add("pokemon-card");
        card.classList.add(`${arrayInfos[i].types[0].type.name}`);
        card.classList.add(`${isPokemonLegendary(i, arraySpecies)}`);
        card.dataset.name = renderedFor;
        card.innerHTML += `
            <div class="card-title-id">
                <h2 class="${isPokemonLegendaryTitle(i, arraySpecies)} pok-title">${formattingFirstLetter(arrayInfos[i].name)}</h2>
                <p class="card-id">#${arrayInfos[i].id}</p>
            </div>
            <h3 class="ger-sub-title">${names_de[arrayInfos[i].id -1]}</h3>
            <img class="main-pic" src="${imgSrc}" alt="${arrayInfos[i].name}">
            <img class="poke-ball" src="./assets/img/03_general/pokeball.svg">
            <div class="types">
                ${arrayInfos[i].types.map(typeInfo => `
                <img 
                    class="type-icon ${typeInfo.type.name}" 
                    title="${typeInfo.type.name}"
                    src="./assets/img/04_type_icons/blank/${typeInfo.type.name}.png" 
                    alt="${typeInfo.type.name}">`
            ).join("")}
                
            </div>
        `;
        card.addEventListener("click", () => {
            openModal(i, arrayInfos, arraySpecies, renderedFor);
        });
        pokemonContainer.appendChild(card);
    }
}

/**
 * Renders the modal for a specific Pokémon's detailed view.
 * 
 * @param {number} index The index of the Pokémon to display in the modal.
 * @param {Object[]} arrayInfos The array containing detailed information about each Pokémon.
 * @param {Object[]} arraySpecies The array containing species-related information for each Pokémon.
 * @param {string} renderedFor A label to specify who the Pokémon cards are being rendered for (search or common data-array).
 * @returns {string} The HTML string that represents the Pokémon modal.
 */
function renderModal(index, arrayInfos, arraySpecies, renderedFor) {
    let pokId = arrayInfos[index].id;
    return pokemonDetailModal.innerHTML = `
        <div class="pok-detail-content ${isPokemonLegendary(index, arraySpecies)} ${arrayInfos[index].types[0].type.name}" id="pokemonDetailContent">
            <div id="pokemonDetails${index}">
                <div class="title-container">
                    <div id="pre-${renderedFor}${index}" onclick="prevPok(event, ${index})" class="prevPok"><</div>
                    <h2 class="${isPokemonLegendaryTitle(index, arraySpecies)}">${formattingFirstLetter(arrayInfos[index].name)}</h2>
                    <div id="nxt-${renderedFor}${index}" onclick="nextPok(event, ${index})" class="nextPok">></div>
                </div>
                <h3 class="ger-sub-title">${names_de[arrayInfos[index].id - 1]}</h3>
                <div class="modal-img-container">
                    <img class="modal-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${arrayInfos[index].id}.png" alt="${arrayInfos[index].id}">
                </div>
                <div class="close-modal-btn" onclick="closeModalBtn()">x</div>
                <img class="poke-cry" onclick="playCry(${pokId})" src="./assets/img/03_general/play_sound.png">
                <p class="poke-index">#${formatPokemonId(arrayInfos[index].id)}</p>
                <div id="general-properties">
                    <div class="modal-infos">
                        <ul class="modal-categories">
                            <li id="stats-${renderedFor}${index}" onclick="showStatsModal(event, ${index})">General</li>
                            <li id="attrbiutes-${renderedFor}${index}" onclick="showAttributes(event, ${index})">Base Stats</li>
                            <li id="evolutions-${renderedFor}${index}" onclick="showEvolutionChain(event, ${index})">Evolution</li>
                            <li id="forms-${renderedFor}${index}" onclick="showForms(event, ${index})">Forms</li>
                        </ul>
                        <div id="modalContent"></div>
                    </div>
                </div>
            </div>
        </div>`;
}

/**
 * Renders a graph displaying the Pokémon's attributes in a bar chart.
 * 
 * @param {Object} arrayInfo The detailed information about a single Pokémon.
 */
function renderGraphAttributes(arrayInfo) {
    const labels = ["Health", "Attack", "Defense", "Special-Atk", "Special-Def", "Speed"];
    const data = arrayInfo.stats.map(stat => stat.base_stat); 
    const modalContentHTML = `
        <div id="statsChart" class="stats-chart">
            <canvas id="pokemonChart"></canvas>
        </div>`;
    document.getElementById('modalContent').innerHTML = modalContentHTML;
    const attributeChart = document.getElementById('pokemonChart').getContext('2d');
    new Chart(attributeChart, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stats',
                data: data,
                backgroundColor: ['#4CAF50','#e8ab13','#dd7200','#3a7bb7','#734aba','#df57d8'],
                borderWidth: 1,
                borderColor: '#00000063',
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    max: 255,
                    grid: { display: false }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 12, family: 'Arial', weight: 'bold', align: 'left' },
                        color: '#333',
                    }
                }
            },
            plugins: { legend: { display: false } },
            responsive: true,
            maintainAspectRatio: false
        },
    });
}

/**
 * Renders the general stats of a Pokémon, such as base experience, height, weight, etc.
 * 
 * @param {Object} infoSource The detailed information about the Pokémon.
 * @param {Object} speciesSource The species-related information for the Pokémon.
 */
function showGeneralStats(infoSource, speciesSource) {
    document.getElementById('modalContent').innerHTML = "";
    document.getElementById('modalContent').innerHTML = `
    <ul class="modal-attributes">
        <li>
            <h3 class="attribute-title">Base XP:</h3>
            <p>${infoSource.base_experience}</p>
        </li>
        <li>
            <h3 class="attribute-title">Height:</h3>
            <p>${formatAttribute(infoSource.height)} m</p>
        </li>
        <li>
            <h3 class="attribute-title">Weight:</h3>
            <p>${formatAttribute(infoSource.weight)} kg</p>
        </li>
        <li>
            <h3 class="attribute-title">Habitat:</h3>
            <p>${speciesSource.habitat?.name ? formattingFirstLetter(speciesSource.habitat.name) : "Not available"}</p>
        </li>
        <li>
            <h3 class="attribute-title">Abilities:</h3>
            <p>${infoSource.abilities.slice(0, 2).map(abilty => formattingFirstLetter(abilty.ability.name)).join(', ')}</p>
        </li>
        <li>
            <h3 class="attribute-title">Types:</h3>
            <div class="type-icons-modal-container">
                <div>
                    ${infoSource.types.map(typeInfo => `
                        <p>${typeInfo.type.name}</p>
                        <img 
                            class="type-icon-modal ${typeInfo.type.name}" 
                            title="${typeInfo.type.name}"
                            src="./assets/img/04_type_icons/blank/${typeInfo.type.name}.png" 
                            alt="${typeInfo.type.name}">
                        `
                    ).join("|")}
                </div>
            </div>
        </li>
        <li>
            <h3 class="attribute-title">Gender:</h3>
            <p class="gender">${getGenderRate(speciesSource)}</p>
        </li>
    </ul>
    `;
}

/**
 * Renders the shiny form of a Pokémon in the modal.
 * 
 * @param {Object} infoSource The detailed information about the Pokémon, including the shiny form pictures.
 */
function renderForms(infoSource) {
    document.getElementById('modalContent').innerHTML = "";
    document.getElementById('modalContent').innerHTML = `
    <div class="shiny-form-container">
            <h3 class="form-title">Shiny Form:</h3>
            <img class="shiny-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${infoSource.id}.png">
            <img class="shiny-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${infoSource.id}.png">
    </div>
    `;
}

/**
 * Retrieves the gender distribution for a Pokémon species based on the gender rate.
 * 
 * @param {Object} speciesSource The species-related information for the Pokémon.
 * @returns {string} A string representing the gender distribution of the Pokémon species.
 */
function getGenderRate(speciesSource) {
    let genderRate = speciesSource.gender_rate;
    const maleSymbol = `<img class="female" src="./assets/img/03_general/male.svg">`;
    const femaleSymbol = `<img class="male" src="./assets/img/03_general/female.svg">`;
    let genderText;

    switch (genderRate) {
        case 0:
            genderText = `100% ${maleSymbol}`;
            break;
        case 1:
            genderText = `87,5% ${maleSymbol} | 12,5% ${femaleSymbol}`;
            break;
        case 2:
            genderText = `75% ${maleSymbol} | 25% ${femaleSymbol}`;
            break;
        case 3:
            genderText = `50% ${maleSymbol} | 50% ${femaleSymbol}`;
            break;
        case 4:
            genderText = `25% ${maleSymbol} | 75% ${femaleSymbol}`;
            break;
        case 5:
            genderText = `12,5% ${maleSymbol} | 87,5% ${femaleSymbol}`;
            break;
        case 6:
            genderText = `100% ${femaleSymbol}`;
            break;
        case 7:
            genderText = "has no gender";
            break;
        case 8:
            genderText = "there is no ratio";
            break;
        default:
            genderText = "no gender";
            break;
    }
    return genderText;
}

/**
 * Renders the evolution chain for the given species.
 * Fetches the evolution data and generates HTML to display the evolution steps.
 * @param {Array} arraySpecies - Array of species data to generate the evolution chain for.
 */
async function renderEvolutionChain(arraySpecies) {
    try {
        const evolutions = await fetchEvolutionChain(arraySpecies);
        let evolutionHTML = "<div class='evolution-container'>";
        evolutionHTML += renderFirstEvolution(evolutions);
        evolutionHTML += renderSecondEvolution(evolutions);
        evolutionHTML += renderThirdEvolution(evolutions);
        evolutionHTML += "</div>";
        checkForEvolutionAndRender(evolutionHTML, evolutions);
    } catch (error) {
        console.error("Fehler beim Anzeigen der Evolution:", error);
        document.getElementById('modalContent').innerHTML = "<p>Error while loading evolution data</p>";
    }
}

/**
 * Renders the first evolution step, if it exists.
 * @param {Object} evolutions - Evolution chain data.
 * @returns {string} HTML content for the first evolution step.
 */
function renderFirstEvolution(evolutions) {
    if (!evolutions.chain.evolves_to.length) {
        return "";
    }
    const firstPokemonId = evolutions.chain.species.url.split('/')[6];
    return `
        <div class="evolution-step">
            <img onclick="playCry(${parseFloat(firstPokemonId)})" class="evo-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstPokemonId}.png" alt="${evolutions.chain.species.name}">
            <p class="evo-name">${formattingFirstLetter(evolutions.chain.species.name)}</p>
        </div>
        <img src="./assets/img/03_general/arrow2.png" class="evo-arrow">`;
}

/**
 * Renders the second evolution step, if it exists.
 * @param {Object} evolutions - Evolution chain data.
 * @returns {string} HTML content for the second evolution step.
 */
function renderSecondEvolution(evolutions) {
    if (evolutions.chain.evolves_to?.[0]?.species?.url) {
        const secondPokemonId = evolutions.chain.evolves_to[0].species.url.split('/')[6];
        return `
            <div class="evolution-step">
                <img onclick="playCry(${parseFloat(secondPokemonId)})" class="evo-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secondPokemonId}.png" alt="${evolutions.chain.evolves_to[0].species.name}">
                <p class="evo-name">${formattingFirstLetter(evolutions.chain.evolves_to[0].species.name)}</p>
            </div>`;
    }
    return "";
}

/**
 * Renders the third evolution step, if it exists.
 * @param {Object} evolutions - Evolution chain data.
 * @returns {string} HTML content for the third evolution step.
 */
function renderThirdEvolution(evolutions) {
    if (evolutions.chain.evolves_to?.[0]?.evolves_to?.[0]?.species?.url) {
        const thirdPokemonId = evolutions.chain.evolves_to[0].evolves_to[0].species.url.split('/')[6];
        return `
        <img src="./assets/img/03_general/arrow2.png" class="evo-arrow">
            <div class="evolution-step">
                <img onclick="playCry(${parseFloat(thirdPokemonId)})" class="evo-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parseFloat(thirdPokemonId)}.png" alt="${evolutions.chain.evolves_to[0].evolves_to[0].species.name}">
                <p class="evo-name">${formattingFirstLetter(evolutions.chain.evolves_to[0].evolves_to[0].species.name)}</p>
            </div>`;
    }
    return "";
}

/**
 * Checks if any evolution steps were rendered and updates the modal with the evolution data.
 * If no evolution steps are available, displays a message indicating that there is no evolution for the Pokémon.
 * @param {string} evolutionHTML - HTML content for the evolution steps.
 */
function checkForEvolutionAndRender(evolutionHTML) {
    if (evolutionHTML === "<div class='evolution-container'></div>") {
        document.getElementById('modalContent').innerHTML = "<p>There is no evolution for this Pokemon</p>";
    } else {
        document.getElementById('modalContent').innerHTML = evolutionHTML;
    }
}

/**
 * Renders filter buttons for Pokémon types, based on the given source array.
 * Creates a set of unique Pokémon types and adds filter buttons for each.
 * @param {Array} sourceArray - Array of Pokémon data to extract types from.
 */
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

/**
 * Renders a loading ball animation inside the loading container.
 */
function renderLoadingBall() {
    loadingContainer.style.animation = "";
    loadingContainer.innerHTML = "";
    loadingContainer.innerHTML = `
        <div class="scroll-ball" id="scrollIcon">
            <div class="ball-outer-body"></div>
            <div class="ball-line"></div>
            <div class="ball-inner-body"></div>
        </div>
        <p class="scroll-down" id="scrollInfo">Scroll down</p>
    `;
}

/**
 * Renders a "load more" button inside the loading container.
 */
function renderLoadingBtn() {
    loadingContainer.style.animation = "none";
    loadingContainer.innerHTML = "";
    loadingContainer.innerHTML = `
        <button onclick="loadMorePokemonBtn()" id="loadButton">
                load more
        </button>
    `;
}

/**
 * Displays an error message in the loading container and resets the filter button.
 * After 1 second, it re-renders the loading ball.
 * 
 * @param {string} errorMessage - The error message to display.
 */
function renderErrorMessage(errorMessage) {
    styleButton(filterConainter, filterBtn, "", "", "", "");
    filterButtonClicked = false;
    loadingContainer.style.animation = "none";
    loadingContainer.innerHTML = `<div id="errorMessage">${errorMessage}</div>`;
    setTimeout(() => {
        renderLoadingBall();
    }, 1400);
}


