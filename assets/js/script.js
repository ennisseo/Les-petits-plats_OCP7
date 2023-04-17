class RecipeCard {
  constructor(recipe) {
    this.recipe = recipe;
    this.recipeCard = this.createRecipeCard();
  }

  createRecipeCard() {
    const recipeCard = document.createElement('article');
    recipeCard.className = 'recipe-card';
    recipeCard.setAttribute("data-id", `${this.recipe.id}`)

    const cardPlaceholder = document.createElement('div');
    cardPlaceholder.className = 'recipe-card-placeholder';
    const cardTextContainer = document.createElement('div');
    cardTextContainer.className = 'recipe-card-text-container';

    const infos = document.createElement('div');
    infos.className = 'recipe-informations';
    const howTo = document.createElement('div');
    howTo.className = 'recipe-how-to';

    const recipeName = document.createElement('h2');
    recipeName.textContent = this.recipe.name;

    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = this.recipe.description;

    const ingredientsList = document.createElement('ul');
    this.recipe.ingredients.forEach(ingredient => {
      const ingredientItem = document.createElement('li');
      const ingredientName = document.createElement('span');
      ingredientName.className = 'ingredient-name';
      ingredientName.textContent = ingredient.ingredient;
      ingredientItem.appendChild(ingredientName);
      if (ingredient.quantity) {
        ingredientItem.innerHTML += `: ${ingredient.quantity} ${ingredient.unit || ''}`;
      }
      ingredientsList.appendChild(ingredientItem);
    });

    const recipeTime = document.createElement('p');
    recipeTime.className = 'recipe-time';
    recipeTime.textContent = ` ${this.recipe.time} min`;
    recipeTime.insertAdjacentHTML('afterbegin', '<i class="far fa-clock"></i>');

    infos.appendChild(recipeName);
    howTo.appendChild(recipeDescription);
    howTo.appendChild(ingredientsList);
    infos.appendChild(recipeTime);

    cardTextContainer.appendChild(infos);
    cardTextContainer.appendChild(howTo);

    recipeCard.appendChild(cardPlaceholder);
    recipeCard.appendChild(cardTextContainer);

    return recipeCard;
  }

  render(container) {
    container.appendChild(this.recipeCard);
  }
}

import recipes from '../data/recipes.js';

const recipeContainer = document.querySelector('.recipes-cards-container');

recipes.forEach(recipe => {
  const recipeCard = new RecipeCard(recipe);
  recipeCard.render(recipeContainer);
});

// FILTRES

function toggleFilterIcon(filterIcon, listContainer, filterInput, filterName, filter) {
  filterIcon.classList.toggle('fa-chevron-down');
  filterIcon.classList.toggle('fa-chevron-up');
  listContainer.classList.toggle('visible');
  filterInput.classList.toggle('visible');
  filterName.classList.toggle('hidden');
  filter.classList.toggle('expand');
}

const ingredientFilter = document.querySelector('.ingredient-filter');
const ingredientFilterIcon = document.querySelector('.ingredient-filter i');
const ingredientsListContainer = document.querySelector('.ingredients-list-container');
const ingredientFilterInput = document.querySelector('.ingredient-input');
const ingredientFilterName = document.querySelector('.ingredient-filter p');

ingredientFilterIcon.addEventListener('click', () => {
  toggleFilterIcon(ingredientFilterIcon, ingredientsListContainer, ingredientFilterInput, ingredientFilterName, ingredientFilter);
  if (appliancesListContainer.classList.contains('visible')) {
    toggleFilterIcon(applianceFilterIcon, appliancesListContainer, applianceFilterInput, applianceFilterName, applianceFilter);
  }
  if (ustensilsListContainer.classList.contains('visible')) {
    toggleFilterIcon(ustensilFilterIcon, ustensilsListContainer, ustensilFilterInput, ustensilFilterName, ustensilFilter);
  }
});

const applianceFilter = document.querySelector('.appliance-filter');
const applianceFilterIcon = document.querySelector('.appliance-filter i');
const appliancesListContainer = document.querySelector('.appliances-list-container');
const applianceFilterInput = document.querySelector('.appliance-input');
const applianceFilterName = document.querySelector('.appliance-filter p');

applianceFilterIcon.addEventListener('click', () => {
  toggleFilterIcon(applianceFilterIcon, appliancesListContainer, applianceFilterInput, applianceFilterName, applianceFilter);
  if (ingredientsListContainer.classList.contains('visible')) {
    toggleFilterIcon(ingredientFilterIcon, ingredientsListContainer, ingredientFilterInput, ingredientFilterName, ingredientFilter);
  }
  if (ustensilsListContainer.classList.contains('visible')) {
    toggleFilterIcon(ustensilFilterIcon, ustensilsListContainer, ustensilFilterInput, ustensilFilterName, ustensilFilter);
  }
});

const ustensilFilter = document.querySelector('.ustensil-filter');
const ustensilFilterIcon = document.querySelector('.ustensil-filter i');
const ustensilsListContainer = document.querySelector('.ustensils-list-container');
const ustensilFilterInput = document.querySelector('.ustensil-input');
const ustensilFilterName = document.querySelector('.ustensil-filter p');

ustensilFilterIcon.addEventListener('click', () => {
  toggleFilterIcon(ustensilFilterIcon, ustensilsListContainer, ustensilFilterInput, ustensilFilterName, ustensilFilter);
  if (ingredientsListContainer.classList.contains('visible')) {
    toggleFilterIcon(ingredientFilterIcon, ingredientsListContainer, ingredientFilterInput, ingredientFilterName, ingredientFilter);
  }
  if (appliancesListContainer.classList.contains('visible')) {
    toggleFilterIcon(applianceFilterIcon, appliancesListContainer, applianceFilterInput, applianceFilterName, applianceFilter);
  }
});

function createList(listContainer, items, itemClass) {
  const list = document.createElement("ul");
  list.className = `${itemClass}-list`;
  listContainer.appendChild(list);

  const itemSet = new Set();

  items.forEach((item) => {
    itemSet.add(item);
  });

  const sortedItems = [...itemSet].sort((a, b) => {
    const aNormalized = a.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const bNormalized = b.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return aNormalized.localeCompare(bNormalized);
  });

  sortedItems.forEach((item) => {
    let listItem = document.createElement("li");
    listItem.className = `${itemClass}-item`;
    listItem.textContent = item;
    list.append(listItem);
  });
}

createList(ingredientsListContainer, recipes.flatMap(recipe => recipe.ingredients.map(i => i.ingredient)), "ingredient");
createList(appliancesListContainer, recipes.map(recipe => recipe.appliance), "appliance");
createList(ustensilsListContainer, recipes.flatMap(recipe => recipe.ustensils), "ustensil");

// SUITE

const selectedFiltersContainer = document.querySelector('.selected-filters-container');
const applianceItems = document.querySelectorAll('.appliance-item');
const ingredientItems = document.querySelectorAll('.ingredient-item');
const ustensilItems = document.querySelectorAll('.ustensil-item');

let matchingCards = [];
let nonMatchingCards;
let matchingTags = [];
let nonMatchingTags = [];

function selectFilter(item, itemName, items) {
  selectedFiltersContainer.classList.add('container-visible');
  const selectedFilter = document.createElement('span');
  selectedFilter.classList.add(itemName, 'selected-item');
  selectedFilter.textContent = item.textContent;
  const selectedFilterIcon = document.createElement('i');
  selectedFilterIcon.className = 'fa-regular fa-circle-xmark';
  selectedFilter.appendChild(selectedFilterIcon);
  selectedFiltersContainer.appendChild(selectedFilter);

  selectedFilterIcon.addEventListener('click', () => {
    selectedFiltersContainer.removeChild(selectedFilter);
    item.classList.remove("hidden");
    const remainingFilters = selectedFiltersContainer.querySelectorAll(".selected-item");

    if (remainingFilters.length === 0) {
      nonMatchingCards.forEach(card => card.classList.remove("hidden"));
      nonMatchingTags.forEach(item => item.classList.remove("hidden"));
      matchingCards = [];
      return;
    } else {
      matchingCards = [];
      recipeCards.forEach(recipeCard => {
        dataId = recipeCard.getAttribute('data-id');
        recipe = recipes.find(recipe => recipe.id == dataId);

        ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
        ustensils = recipe.ustensils;
        const filters = [...remainingFilters].map(filter => filter.textContent);

        // Check if the card matches all the selected filters
        if (filters.every(filter => ingredients.includes(filter) || ustensils.includes(filter) || recipe.appliance === filter)) {
          matchingCards.push(recipeCard);
        }
      });

      // Show the matching cards and hide the non-matching cards
      recipeCards.forEach(card => {
        if (matchingCards.includes(card)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    }

    lookForItems(remainingFilters, items);

    const isNoMatchMessage = document.querySelector(".no-match-message");
    if (isNoMatchMessage) {
      isNoMatchMessage.remove();
    }
  });
}

function lookForItems(remainingFilters, items) {
  const displayedCards = document.querySelectorAll(".recipe-card:not(.hidden)");
  displayedCards.forEach(displayedCard => {
    dataId = displayedCard.getAttribute("data-id");
    recipe = recipes.find(recipe => recipe.id == dataId);
    ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient);
    ustensils = recipe.ustensils;
    items.forEach(item => {
      ingredients.forEach(ingredient => {
        if (ingredient === item.textContent) {
          item.classList.remove("hidden")
        }
      });
      ustensils.forEach(ustensil => {
        if (ustensil === item.textContent) {
          item.classList.remove("hidden")
        }
      });
      remainingFilters.forEach(remainingFilter => {
        if (remainingFilter.textContent === item.textContent) {
          item.classList.add("hidden")
        }
      });
    });
  });
}

const noMatchMessage = document.createElement("li");
noMatchMessage.textContent = "Aucun résultat";
noMatchMessage.classList.add("no-match-message");

let selectedFilters;
let recipeCards = document.querySelectorAll(".recipe-card");
let dataId;
let recipe;
let ingredients;
let ustensils;

sortRecipesAndItems(ingredientItems, "ingredient");
sortRecipesAndItems(applianceItems, "appliance");
sortRecipesAndItems(ustensilItems, "ustensil");

// SORTING FUNCTION

function sortRecipesAndItems(items, selectedClass, itemName) {
  items.forEach(item => {
    item.addEventListener("click", () => {
      selectFilter(item, selectedClass, itemName, items);
      const selectedItem = item.textContent;
      selectedFilters = document.querySelectorAll(".selected-item");
      item.classList.add("hidden");
      // ingredientsSearch.value = "";
      // lookForMatch(ingredientsSearch, ingredientsList, ingredientsItems, selectedFilters);

      const allItems = [];
      allItems.push(ingredientItems)
      allItems.push(applianceItems)
      allItems.push(ustensilItems)

      if (selectedFilters.length > 1) {
        matchingCards = [];
      }

      recipeCards.forEach(recipeCard => {
        dataId = recipeCard.getAttribute('data-id');
        recipe = recipes.find(recipe => recipe.id == dataId);

        ingredients = recipe.ingredients;
        ingredients.forEach(ingredient => {
          if (ingredient.ingredient === selectedItem) {
            matchingCards.push(recipeCard)
          }
        });

        if (recipe.appliance === selectedItem) {
          matchingCards.push(recipeCard);
        }

        ustensils = recipe.ustensils;
        ustensils.forEach(ustensil => {
          if (ustensil === selectedItem) {
            matchingCards.push(recipeCard)
          }
        });
      });

      nonMatchingCards = Array.from(recipeCards).filter(recipeCard => {
        return !matchingCards.includes(recipeCard);
      });

      nonMatchingCards.forEach(nonMatchingCard => {
        nonMatchingCard.classList.add("hidden");
      })

      matchingTags = [];

      let matchingItems = [];
      matchingCards.forEach(matchingCard => {
        dataId = matchingCard.getAttribute('data-id')
        recipe = recipes.find(recipe => recipe.id == dataId);
        ingredients = recipe.ingredients;
        ustensils = recipe.ustensils;

        allItems.forEach(array => {
          array.forEach(item => {
            ustensils.forEach(ustensil => {
              if (item.textContent == ustensil) {
                matchingItems.push(ustensil)
              }
            })
            ingredients.forEach(ingredient => {
              if (item.textContent == ingredient.ingredient) {
                matchingItems.push(ingredient.ingredient)
              }
            })
            if (item.textContent == recipe.appliance) {
              matchingItems.push(recipe.appliance)
            }
            matchingItems.forEach(matchingItem => {
              if (matchingItem == item.textContent) {
                matchingTags.push(item);
              }
            });
            if (matchingTags.includes(item)) {
              matchingTags.push(item)
            }
          });
        });
      })

      allItems.forEach(array => {
        array.forEach(item => {
          if (!matchingTags.includes(item)) {
            nonMatchingTags.push(item);
          }
        });
      });

      nonMatchingTags.forEach(tag => {
        tag.classList.add("hidden")
      });

      // Check if all child elements are hidden
      const allHidden = Array.from(items).every(child => child.classList.contains("hidden"));

      const isNoMatchMessage = document.querySelector(".no-match-message");

      if (allHidden) {
        if (!isNoMatchMessage) {
          item.parentNode.appendChild(noMatchMessage);
        }
      } else {
        if (isNoMatchMessage) {
          isNoMatchMessage.remove();
        }
      }
    });
  });
}

// RECHERCHE DANS LES FILTRES PAR INPUT

const ingredientSearch = document.querySelector(".ingredient-input");
const ingredientsList = document.querySelector(".ingredients-list");
const applianceSearch = document.querySelector(".appliance-input");
const appliancesList = document.querySelector(".appliances-list");
const ustensilSearch = document.querySelector(".ustensil-input");
const ustensilsList = document.querySelector(".ustensils-list");

function lookForMatch(searchInput, itemsList, items, selectedFilters) {
  let matchFound = false;

  items.forEach(item => {
    if (item.textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
      item.classList.remove("hidden");
      if (!Array.from(selectedFilters).some(filter => filter.textContent === item.textContent)) {
        matchFound = true;
      }
    } else {
      item.classList.add("hidden");
    }
  });

  const isNoMatchMessage = itemsList.querySelector(".no-match-message");

  if (!matchFound) {
    if (!isNoMatchMessage) {
      itemsList.appendChild(noMatchMessage);
    }
  } else {
    if (isNoMatchMessage) {
      isNoMatchMessage.remove();
    }
  }

  items.forEach(item => {
    selectedFilters.forEach(selectedFilter => {
      if (selectedFilter.textContent === item.textContent) {
        item.classList.add("hidden");
      }
    });
  });
}

ingredientSearch.addEventListener('input', () => {
  selectedFilters = document.querySelectorAll(".ingredient-selected-item");
  if (matchingIngredients) {
    ingredientsItems = matchingIngredients;
    if (matchingIngredients.length === 0) {
      ingredientsItems = document.querySelectorAll('.ingredient-item');
      lookForMatch(ingredientSearch, ingredientsList, ingredientsItems, selectedFilters);
    }
  }
  lookForMatch(ingredientSearch, ingredientsList, ingredientsItems, selectedFilters);
});

applianceSearch.addEventListener('input', () => {
  const selectedFilters = document.querySelectorAll(".appliance-selected-item");
  lookForMatch(applianceSearch, appliancesList, appliancesItems, selectedFilters);
});

ustensilSearch.addEventListener('input', () => {
  const selectedFilters = document.querySelectorAll(".ustensil-selected-item");
  lookForMatch(ustensilSearch, ustensilsList, ustensilsItems, selectedFilters);
});

// RECHERCHE PRINCIPALE
const form = document.querySelector('form');
const primarySearchInput = document.getElementById('recipe-search');


form.addEventListener("submit", (event) => {
  event.preventDefault();
})

primarySearchInput.addEventListener('input', () => {
  if (primarySearchInput.value.length > 2) {
    console.log(primarySearchInput.value)
  }
});