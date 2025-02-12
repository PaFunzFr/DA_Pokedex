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

/**
 * Event listener that triggers the function to check the window height 
 * and show either a loading button or a loading ball when the window is resized.
 */
window.addEventListener("resize", checkWindowHeightAndShowLoadingButton);

/**
 * Checks the current window height and the number of Pokemon currently shown,
 * and displays a loading button if the window height is greater than or equal to 2200px 
 * and exactly 30 Pokemon are shown. Otherwise, it displays a loading ball.
 */
function checkWindowHeightAndShowLoadingButton() {
    if (window.innerHeight >= 2200 && currentShownPokemon === 30) {
        renderLoadingBtn(); // Show the loading button if the conditions are met
    } else {
        renderLoadingBall(); // Show the loading ball otherwise
    }
}
