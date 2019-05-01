import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
// import { stat } from 'fs';

// * Global state of the app
// * - Search object
// * - Current recipe object
// * - Shopping list objetc
// * - Liked recipes
const state = {};
window.state = state;

// ? SEARCH CONTROLLER ##################################################################################################
const controlSearch = async () => {

    // 1. get query from view
    const query = searchView.getInput();
    // const query = 'pizza';
    // console.log(query);

    // if ter is a query
    if (query) {
        // 2. News search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for recipes
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes and await the result
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert(`Search: #1 Error processing [${err}]`);
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// TESTING without search ---------------------------------------
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });
// -------------------------------------------------------------

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// ? RECIPE CONTROLLER ##################################################################################################
const controlRecipe = async () => {
    // get the hash value and remove # to keep just numbers
    const id = window.location.hash.replace('#', '');
    // console.log(id);

    // just run if exist some value there
    if (id) {

        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight  selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe objetc
        state.recipe = new Recipe(id);

        // TESTING --------------------------------
        // window.r = state.recipe
        // ----------------------------------------

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            // console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            alert(`Recipe: #1 Error processing [${err}]`);
        }

    }
};

// for each event verufy if the hashtag on url was changed, if yes call recipe controller function
// window.addEventListener('hashchange', controlRecipe);
// On first load without events they will verify # and show recipe if is true
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// ? LIST CONTROLLER ##################################################################################################

const controlList = () => {

    // create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    // get the element by class that and get the data-itemid value
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete button
    if (e.target.matches('shopping__delete, .shopping__delete *')) {
        // Dele from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        // read the data from interface
        const val = parseFloat(e.target.value);

        // update data
        state.list.updateCount(id, val);
    }
});

// handling rcipe button clicks
elements.recipe.addEventListener('click', e => {
    // use * to consider any children of the element
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn, .recipe__btn *')) {
        controlList()
    }
    // console.log(state.recipe);
});

window.l = new List();