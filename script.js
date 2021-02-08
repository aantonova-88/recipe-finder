const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  categoryEl = document.getElementById('category-elements'),
  recipeEl = document.getElementById('recipe-elements'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');
  mainTitle = document.getElementById('main-title');

function checkStorage () {
  const mealCategory = localStorage.getItem('mealCategory');
  const recipeMeal = localStorage.getItem('recipeID');
  const searchKey = localStorage.getItem('searchKey');

  if (recipeMeal) {
    showSingleMeal(recipeMeal);
  } else if (mealCategory) {
    showRecipes(mealCategory);
  } else if (searchKey) {
    showSearchResults(searchKey);
  } else {
    showCategories();
  }
}

checkStorage();

function showCategories() {
  fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  .then(res => res.json())
  .then(data => {categoryEl.innerHTML = data.categories.map(item => `
    <div class="category">
      <img src="${item.strCategoryThumb}"/>
      <div class="category-info" data-category="${item.strCategory}">
        <h3>${item.strCategory}</h3>
      </div>
    </div>`).join('');
  })
}



function showRecipes(category) {
  resultHeading.innerHTML = `<h2>Results for category "${category}"</h2>`;
  categoryEl.style.display = 'none';
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then(res => res.json())
    .then(data => {
      recipeEl.innerHTML = data.meals.map(item => `
      <div class="category">
        <img src="${item.strMealThumb}"/>
        <div class="category-info" data-idMeal="${item.idMeal}">
          <h3>${item.strMeal}</h3>
        </div>
      </div>`).join('');
    })
}

function showSingleMeal(recipeID) {
    categoryEl.style.display = 'none';
    recipeEl.style.display = 'none';
    resultHeading.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeID}`)
    .then(res => res.json())
    .then(data => {
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        if (data.meals[0][`strIngredient${i}`]) {
          ingredients.push(`${data.meals[0][`strIngredient${i}`]} - ${data.meals[0][`strMeasure${i}`]}`);
        } else {
          break;
        }
      }
      single_mealEl.innerHTML = `
      <div class="meal">
        <h2>${data.meals[0].strMeal}</h2>
        <img src="${data.meals[0].strMealThumb}"/>
        <h3>${data.meals[0].strCategory}</h3>
        <p>${data.meals[0].strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
      `
    })
}

function showSearchResults (term) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    .then(res => res.json())
    .then(data => {
      recipeEl.innerHTML = data.meals.map(item => `
      <div class="category">
        <img src="${item.strMealThumb}"/>
        <div class="category-info" data-idMeal="${item.idMeal}">
          <h3>${item.strMeal}</h3>
        </div>
      </div>`).join('');
    })
    search.value = '';
}

// Event listeners
categoryEl.addEventListener('click', e => {
  const categoryInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('category-info');
    } else {
      return false;
    }
  });

  if (categoryInfo) {
    const mealCategory = categoryInfo.getAttribute('data-category');
    localStorage.setItem('mealCategory', mealCategory);
    showRecipes(mealCategory);
    }
})

recipeEl.addEventListener('click', e => {
  const recipeInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('category-info');
    } else {
      return false;
    }
  });

  if (recipeInfo) {
    const recipeID = recipeInfo.getAttribute('data-idMeal');
    localStorage.setItem('recipeID', recipeID);
    showSingleMeal(recipeID);
    }
});

submit.addEventListener('submit', e => {
  e.preventDefault();
  categoryEl.style.display = 'none';
  resultHeading.innerHTML = '';
  const term = search.value.trim();
  localStorage.setItem('searchKey', term);
  showSearchResults(term);
});


mainTitle.addEventListener('click', e => {
  localStorage.clear();
})
