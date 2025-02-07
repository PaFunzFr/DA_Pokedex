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
            <h2 class="${isPokemonLegendaryTitle(i)}">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <p>#${pokemon.id}</p>
            <img class="main-pic" src="${imgSrc}" alt="${pokemon.name}">
            ${renderPokeBall()}
            <div class="types">${pokemon.types.map(types => `<div class="type-info ${types.type.name}">${types.type.name}</div>`).join("")}</div>
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
                <h2 class="${isPokemonLegendaryTitle(index)}">${allPokemonInfos[index].name}</h2>
                <img class="modal-img"src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${allPokemonInfos[index].id}.png" alt="${allPokemonInfos[index].name}">
                <img class="poke-cry" onclick="playCry(${index})" src="../assets/img/03_general/play_sound.png">
                <p class="poke-index">#${formatPokemonId(allPokemonInfos[index].id)}</p>
                <div id="general-properties">
                <div class="modal-infos">
                    <ul class="modal-categories">
                        <li onclick="showGeneralStats(${index})">General</li>
                        <li onclick="showAttributes(${index})">Attributes</li>
                        <li onclick="showEvolutionChain(${index})">Evolution</li>
                    </ul>
                    <div id="modalContent"></div>
                    <img src="../assets/img/03_general/arrow2.png" class="triangle-button" id="prevPok">
                    <img src="../assets/img/03_general/arrow2.png" class="triangle-button" id="nextPok">
                </div>
            </div>
        </div>`;
};

function showAttributes(index) {
    document.getElementById('modalContent').innerHTML = "";
    const pokStats = allPokemonInfos[index].stats;
    const labels = ["Health", "Attack", "Defense", "Special-Atk", "Special-Def", "Speed"];
    const data = pokStats.map(stat => stat.base_stat);
    const modalContentHTML = `<div id="statsChart" class="stats-chart"><canvas id="pokemonChart"></canvas></div>`;
    document.getElementById('modalContent').innerHTML = modalContentHTML;
    const ctx = document.getElementById('pokemonChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stats',
                data: data,
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1
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
                        align: 'left'
                    }
                }
            },
            plugins: { legend: { display: false } },
            responsive: true,
            maintainAspectRatio: false
        }
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
            <p>${allPokemonSpecies[index].habitat.name}</p>
        </li>
        <li>
            <h3 class="attribute-title">Abilities:</h3>
            <p>${allPokemonInfos[index].id}</p>
        </li>
        <li>
            <h3 class="attribute-title">Types:</h3>
            <p>${allPokemonInfos[index].types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        </li>
    </ul>
    `;
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
    const firstPokemonId = evolutions.chain.species.url.split('/')[6];
    return `
        <div class="evolution-step">
            <img class="evo-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstPokemonId}.png" alt="${evolutions.chain.species.name}">
            <p class="evo-name">${evolutions.chain.species.name}</p>
        </div>
        <img src="../assets/img/03_general/arrow2.png" class="evo-arrow">`;
}

function renderSecondEvolution(evolutions) {
    if (evolutions.chain.evolves_to?.[0]?.species?.url) {
        const secondPokemonId = evolutions.chain.evolves_to[0].species.url.split('/')[6];
        return `
            <div class="evolution-step">
                <img class="evo-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secondPokemonId}.png" alt="${evolutions.chain.evolves_to[0].species.name}">
                <p class="evo-name">${evolutions.chain.evolves_to[0].species.name}</p>
            </div>
            <img src="../assets/img/03_general/arrow2.png" class="evo-arrow">`;
    }
    return "";
}

function renderThirdEvolution(evolutions) {
    if (evolutions.chain.evolves_to?.[0]?.evolves_to?.[0]?.species?.url) {
        const thirdPokemonId = evolutions.chain.evolves_to[0].evolves_to[0].species.url.split('/')[6];
        return `
            <div class="evolution-step">
                <img class="evo-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${thirdPokemonId}.png" alt="${evolutions.chain.evolves_to[0].evolves_to[0].species.name}">
                <p class="evo-name">${evolutions.chain.evolves_to[0].evolves_to[0].species.name}</p>
            </div>`;
    }
    return "";
}

function checkForEvolutionAndRender(evolutionHTML, evolutions) {
    if (evolutionHTML === "<div class='evolution-container'></div>") {
        document.getElementById('modalContent').innerHTML = "<p>There is no evolution for this Pokemon</p>";
    } else {
        document.getElementById('modalContent').innerHTML = evolutionHTML;
    }
}

function renderPokeBall() {
    return `
        <svg class="poke-ball" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <mask id="cutout">
                <rect width="200" height="200" fill="white" />
                <circle cx="100" cy="100" r="36" fill="black" />
            </mask>
            <path d="M100,10 A90,90 0 0,1 190,100 H10 A90,90 0 0,1 100,10 Z" fill="black" opacity="0.5" mask="url(#cutout)" />
            <path d="M10,115 H190 A90,90 0 0,1 100,190 A90,90 0 0,1 10,115 Z" fill="black" opacity="0.5" mask="url(#cutout)" />
            <circle cx="100" cy="100" r="24" fill="black" opacity="0.5" />
        </svg>`
}


