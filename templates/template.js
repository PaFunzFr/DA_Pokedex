function renderPokemonCards(offset) {
    for (let i = offset; i < allPokemonInfos.length; i++) {
        const pokemon = allPokemonInfos[i];
        const card = document.createElement("div");
        const imgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        card.classList.add("pokemon-card");
        card.classList.add(`${pokemon.types[0].type.name}`);
        card.classList.add(`${isPokemonLegendary(i)}`);
        card.dataset.name = pokemon.name;
        card.innerHTML += `
            <div class="card-title-id">
                <h2 class="${isPokemonLegendaryTitle(i)}">${formattingFirstLetter(pokemon.name)}</h2>
                <p class="card-id">#${pokemon.id}</p>
            </div>
            <h3 class="ger-sub-title">${names_de[i]}</h3>
            <img class="main-pic" src="${imgSrc}" alt="${pokemon.name}">
            <img class="poke-ball" src="../assets/img/03_general/pokeball.svg">
            <div class="types">
                ${allPokemonInfos[i].types.map(typeInfo => `
                <img 
                    class="type-icon ${typeInfo.type.name}" 
                    title="${typeInfo.type.name}"
                    src="./assets/img/04_type_icons/blank/${typeInfo.type.name}.png" 
                    alt="${typeInfo.type.name}">`
            ).join("")}
                
            </div>
        `;
        card.addEventListener("click", () => {
            openModal(pokemon.id);
        });
        pokemonContainer.appendChild(card);
    }
}

function renderModal(index) {
    return pokemonDetailModal.innerHTML = `
        <div class="pok-detail-content ${isPokemonLegendary(index)} ${allPokemonInfos[index].types[0].type.name}" id="pokemonDetailContent">
            <div id="pokemonDetails">
                <div class="title-container">
                    <div onclick="prevPok(${index})" id="prevPok"><</div>
                    <h2 class="${isPokemonLegendaryTitle(index)}">${formattingFirstLetter(allPokemonData[index].name)}</h2>
                    <div onclick="nextPok(${index})" id="nextPok">></div>
                </div>
                <h3 class="ger-sub-title">${names_de[index]}</h3>
                <div class="modal-img-container">
                    <img class="modal-img"src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${allPokemonInfos[index].id}.png" alt="${allPokemonInfos[index].name}">
                </div>
                <div class="close-modal-btn" onclick="closeModalBtn()">x</div>
                <img class="poke-cry" onclick="playCry(${index})" src="./assets/img/03_general/play_sound.png">
                <p class="poke-index">#${formatPokemonId(allPokemonInfos[index].id)}</p>
                <div id="general-properties">
                <div class="modal-infos">
                    <ul class="modal-categories">
                        <li onclick="showGeneralStats(${index})">General</li>
                        <li onclick="showAttributes(${index})">Base Stats</li>
                        <li onclick="showEvolutionChain(${index})">Evolution</li>
                        <li onclick="showForms(${index})">Forms</li>
                    </ul>
                    <div id="modalContent"></div>
                </div>
            </div>
        </div>`;
};

function showAttributes(index) {
    document.getElementById('modalContent').innerHTML = "";
    const pokStats = allPokemonInfos[index].stats;
    const labels = ["Health", "Attack", "Defense", "Special-Atk", "Special-Def", "Speed"];
    const data = pokStats.map(stat => stat.base_stat);
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

function showGeneralStats(index) {
    document.getElementById('modalContent').innerHTML = "";
    document.getElementById('modalContent').innerHTML = `
    <ul class="modal-attributes">
        <li>
            <h3 class="attribute-title">Base XP:</h3>
            <p>${allPokemonInfos[index].base_experience}</p>
        </li>
        <li>
            <h3 class="attribute-title">Height:</h3>
            <p>${formatAttribute(allPokemonInfos[index].height)} m</p>
        </li>
        <li>
            <h3 class="attribute-title">Weight:</h3>
            <p>${formatAttribute(allPokemonInfos[index].weight)} kg</p>
        </li>
        <li>
            <h3 class="attribute-title">Habitat:</h3>
            <p>${allPokemonSpecies[index].habitat?.name ? formattingFirstLetter(allPokemonSpecies[index].habitat.name) : "Not available"}</p>
        </li>
        <li>
            <h3 class="attribute-title">Abilities:</h3>
            <p>${allPokemonInfos[index].abilities.slice(0, 2).map(abilty => formattingFirstLetter(abilty.ability.name)).join(', ')}</p>
        </li>
        <li>
            <h3 class="attribute-title">Types:</h3>
            <div class="type-icons-modal-container">
                <div>
                    ${allPokemonInfos[index].types.map(typeInfo => `
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
            <p class="gender">${getGenderRate(index)}</p>
        </li>
    </ul>
    `;
}

function showForms(index) {
    document.getElementById('modalContent').innerHTML = "";
    document.getElementById('modalContent').innerHTML = `
    <div class="shiny-form-container">
            <h3 class="form-title">Shiny Form:</h3>
            <img class="shiny-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${allPokemonInfos[index].id}.png">
            <img class="shiny-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${allPokemonInfos[index].id}.png">
    </div>
    `;
}


function getGenderRate(index) {
    let genderRate = allPokemonSpecies[index].gender_rate;
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


async function showEvolutionChain(index) {
    try {
        const evolutions = await fetchEvolutionChain(index);
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

function renderFirstEvolution(evolutions) {
    if (!evolutions.chain.evolves_to.length) {
        return "";
    }
    const firstPokemonId = evolutions.chain.species.url.split('/')[6];
    return `
        <div class="evolution-step">
            <img onclick="playCry(${parseFloat(firstPokemonId) - 1})" class="evo-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstPokemonId}.png" alt="${evolutions.chain.species.name}">
            <p class="evo-name">${formattingFirstLetter(evolutions.chain.species.name)}</p>
        </div>
        <img src="./assets/img/03_general/arrow2.png" class="evo-arrow">`;
}

function renderSecondEvolution(evolutions) {
    if (evolutions.chain.evolves_to?.[0]?.species?.url) {
        const secondPokemonId = evolutions.chain.evolves_to[0].species.url.split('/')[6];
        return `
            <div class="evolution-step">
                <img onclick="playCry(${parseFloat(secondPokemonId) - 1})" class="evo-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secondPokemonId}.png" alt="${evolutions.chain.evolves_to[0].species.name}">
                <p class="evo-name">${formattingFirstLetter(evolutions.chain.evolves_to[0].species.name)}</p>
            </div>`;
    }
    return "";
}

function renderThirdEvolution(evolutions) {
    if (evolutions.chain.evolves_to?.[0]?.evolves_to?.[0]?.species?.url) {
        const thirdPokemonId = evolutions.chain.evolves_to[0].evolves_to[0].species.url.split('/')[6];
        return `
        <img src="./assets/img/03_general/arrow2.png" class="evo-arrow">
            <div class="evolution-step">
                <img onclick="playCry(${parseFloat(thirdPokemonId) - 1})" class="evo-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${parseFloat(thirdPokemonId)}.png" alt="${evolutions.chain.evolves_to[0].evolves_to[0].species.name}">
                <p class="evo-name">${formattingFirstLetter(evolutions.chain.evolves_to[0].evolves_to[0].species.name)}</p>
            </div>`;
    }
    return "";
}


function checkForEvolutionAndRender(evolutionHTML) {
    if (evolutionHTML === "<div class='evolution-container'></div>") {
        document.getElementById('modalContent').innerHTML = "<p>There is no evolution for this Pokemon</p>";
    } else {
        document.getElementById('modalContent').innerHTML = evolutionHTML;
    }
}




