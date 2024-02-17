const get_meal_btn = document.getElementById('get_meal');
const meal_container=document.getElementById('meal');

// Fetch categories and populate dropdown
fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('category');
        data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.strCategory;
            option.textContent = category.strCategory;
            select.appendChild(option);
        });
    })
    .catch(error => console.error(error));

// Fetch random meal from selected category when button is clicked
document.getElementById('get_meal').addEventListener('click', (event) => {
    event.preventDefault();
    const category = document.getElementById('category').value;
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(res => res.json())
        .then(res => {
            const meals = res.meals;
            const randomIndex = Math.floor(Math.random() * meals.length);
            const randomMeal = meals[randomIndex];
            return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`);
        })
        .then(res => res.json())
        .then(res => {
            createMeal(res.meals[0]);
        })
        .catch(error => console.error(error));
});

const createMeal = meal => {
	const ingredients = [];

	// Get all ingredients from the object.
	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`]) {
			ingredients.push(
				`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
			);
		} else {
			// Stop if there are no more ingredients
			break;
		}
	}

	const newInnerHTML = `
		<div class="row">
			<div class="columns five">
				<img src="${meal.strMealThumb}" alt="max-width: 1%;">
				${
					meal.strCategory
						? `<p><strong>Category:</strong> ${meal.strCategory}</p>`
						: ''
				}
				${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ''}
				${
					meal.strTags
						? `<p><strong>Tags:</strong> ${meal.strTags
								.split(',')
								.join(', ')}</p>`
						: ''
				}
				<h3>Ingredients:</h3>
				<ul class="list">
					${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
				</ul>
			</div>
			<div class="columns seven">
				<h2>${meal.strMeal}</h2>
				<p>${meal.strInstructions}</p>
			</div>
		</div>
		${
			meal.strYoutube
				? `
		<div class="row">
			<h2>Video Recipe</h2>
			<div class="videoWrapper">
				<iframe width="420" height="315"
				src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}">
				</iframe>
			</div>
		</div>`
				: ''
		}
	`;

	meal_container.innerHTML = newInnerHTML;
};
