/**
 * Event listener for infinite scrolling.
 * Loads more Pokémon when the user reaches the bottom of the page.
 */
window.addEventListener("scroll", async () => {
    if (!isLoadingEnabled) return; 
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        isLoadingEnabled = false;
        await loadMorePokemon();
        renderFilterButtons(allPokemonInfos);
        isLoadingEnabled = true;
    }
});

/**
 * Disables loading more Pokémon on scroll.
 */
function disableLoadOnScroll() {
    isLoadingEnabled = false;
}

/**
 * Enables loading more Pokémon on scroll.
 */
function enableLoadOnScroll() {
    isLoadingEnabled = true;
}

/**
 * Disables scrolling by hiding overflow and adding padding to prevent layout shift.
 */
function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '17px';
}

/**
 * Enables scrolling by restoring default overflow and padding.
 */
function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

/**
 * Adds a drop shadow effect based on the user's scroll position.
 */
window.addEventListener("scroll", () => {
    let shadow = document.querySelector(".shadow-top");
    let scrollPosition = window.scrollY;
    if (scrollPosition > 90) {
        shadow.style.height = "200px";
    } else {
        shadow.style.height = "80px";
    }
});
