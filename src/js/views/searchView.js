import {
    elements
} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    // remove old highlight
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    // heighlight new clicked item
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const newTitle = [];
        // don't cut words, count words without spaces
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const renderRecipe = recipeIndex => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipeIndex.recipe.uri}">
                <figure class="results__fig">
                    <img src="${recipeIndex.recipe.image}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipeIndex.recipe.label)}</h4>
                    <p class="results__author"><strong>Calories: ${Math.ceil(recipeIndex.recipe.calories)}</strong></p>
                    <p class="results__author">Prepare Time: ${Math.ceil(recipeIndex.recipe.totalTime)}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}" ></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    // discover number of pages and remove decimal
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    // to insert in the DOM
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    //const start = (page - 1) * resPerPage;
    //const end = page * resPerPage;
    
    recipes.forEach(el => renderRecipe(el));

    // render pagination buttons
    //renderButtons(page, recipes.length, resPerPage);
};