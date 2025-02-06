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
                <div id="general-properties">
                <div class="modal-infos">
                    <ul class="modal-categories">
                        <li onclick="showGeneralStats(${index}), playCry(${index})">General</li>
                        <li onclick="showAttributes(${index})">Attributes</li>
                        <li onclick="showEvolutionChain(${index})">Evolution</li>
                    </ul>
                    <div id="modalContent"></div>
                    <button id="prevPok">Previous</button>
                    <button id="nextPok">Next</button>
                </div>
            </div>
        </div>`;
};

function showAttributes(index) {
    document.getElementById('modalContent').innerHTML = "";
    const pokStats = allPokemonInfos[index].stats;
    document.getElementById('modalContent').innerHTML = `
    <ul class="modal-attributes">
        <li>
            <h3 class="attribute-title">Health:</h3>
            <div class="attribute-bar" style="width: ${calculateBarWidth(pokStats[0].base_stat)}px;"></div>
        </li>
        <li>
            <h3 class="attribute-title">Attack:</h3>
            <div class="attribute-bar" style="width: ${calculateBarWidth(pokStats[1].base_stat)}px;"></div>
        </li>
        <li>
            <h3 class="attribute-title">Defense:</h3>
            <div class="attribute-bar" style="width: ${calculateBarWidth(pokStats[2].base_stat)}px;"></div>
        </li>
        <li>
            <h3 class="attribute-title">Special-Atk:</h3>
            <div class="attribute-bar" style="width: ${calculateBarWidth(pokStats[3].base_stat)}px;"></div>
        </li>
        <li>
            <h3 class="attribute-title">Special-Def:</h3>
            <div class="attribute-bar" style="width: ${calculateBarWidth(pokStats[4].base_stat)}px;"></div>
        </li>
        <li>
            <h3 class="attribute-title">Speed:</h3>
            <div class="attribute-bar" style="width: ${calculateBarWidth(pokStats[5].base_stat)}px;"></div>
        </li>
    </ul>
    `;
}

function showGeneralStats(index) {
    document.getElementById('modalContent').innerHTML = "";
    document.getElementById('modalContent').innerHTML = `
    <ul class="modal-attributes">
        <li>
            <h3 class="attribute-title">Index:</h3>
            <p>${allPokemonInfos[index].id}</p>
        </li>
        <li>
            <h3 class="attribute-title">Base XP:</h3>
            <p>${allPokemonInfos[index].base_experience}</p>
        </li>
        <li>
            <h3 class="attribute-title">Height:</h3>
            <p>${allPokemonInfos[index].height}</p>
        </li>
        <li>
            <h3 class="attribute-title">Weight:</h3>
            <p>${allPokemonInfos[index].weight}</p>
        </li>
        <li>
            <h3 class="attribute-title">Types:</h3>
            <p>${allPokemonInfos[index].types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        </li>
    </ul>
    `;
}

function showEvolutionChain(index) {
    document.getElementById('modalContent').innerHTML = "";
    document.getElementById('modalContent').innerHTML = `
        <p>Test</p>
    `
}