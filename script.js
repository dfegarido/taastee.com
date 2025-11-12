// Sample meal database (in a real app, this would come from an API)
const mealDatabase = {
    anything: [
        { name: "Grilled Chicken Breast", calories: 250, carbs: 0, fat: 5, protein: 50, meal: "Lunch" },
        { name: "Brown Rice Bowl", calories: 200, carbs: 45, fat: 2, protein: 5, meal: "Lunch" },
        { name: "Salmon with Vegetables", calories: 350, carbs: 20, fat: 15, protein: 30, meal: "Dinner" },
        { name: "Greek Yogurt with Berries", calories: 150, carbs: 20, fat: 2, protein: 15, meal: "Breakfast" },
        { name: "Whole Wheat Toast with Avocado", calories: 200, carbs: 25, fat: 10, protein: 8, meal: "Breakfast" },
        { name: "Quinoa Salad", calories: 300, carbs: 50, fat: 8, protein: 12, meal: "Lunch" },
        { name: "Turkey Wrap", calories: 280, carbs: 30, fat: 8, protein: 25, meal: "Lunch" },
        { name: "Oatmeal with Nuts", calories: 250, carbs: 40, fat: 8, protein: 10, meal: "Breakfast" },
        { name: "Beef Stir Fry", calories: 400, carbs: 35, fat: 12, protein: 35, meal: "Dinner" },
        { name: "Pasta with Marinara", calories: 350, carbs: 60, fat: 5, protein: 12, meal: "Dinner" }
    ],
    keto: [
        { name: "Bacon and Eggs", calories: 300, carbs: 2, fat: 25, protein: 20, meal: "Breakfast" },
        { name: "Grilled Salmon with Asparagus", calories: 350, carbs: 5, fat: 20, protein: 35, meal: "Dinner" },
        { name: "Cauliflower Rice Bowl", calories: 200, carbs: 8, fat: 12, protein: 15, meal: "Lunch" },
        { name: "Keto Smoothie", calories: 250, carbs: 5, fat: 20, protein: 10, meal: "Breakfast" },
        { name: "Chicken Caesar Salad (no croutons)", calories: 300, carbs: 5, fat: 18, protein: 30, meal: "Lunch" },
        { name: "Zucchini Noodles with Meatballs", calories: 400, carbs: 10, fat: 25, protein: 35, meal: "Dinner" }
    ],
    mediterranean: [
        { name: "Greek Salad with Feta", calories: 250, carbs: 15, fat: 18, protein: 12, meal: "Lunch" },
        { name: "Grilled Fish with Lemon", calories: 300, carbs: 5, fat: 12, protein: 35, meal: "Dinner" },
        { name: "Hummus with Vegetables", calories: 200, carbs: 20, fat: 10, protein: 8, meal: "Snack" },
        { name: "Mediterranean Quinoa Bowl", calories: 350, carbs: 45, fat: 12, protein: 15, meal: "Lunch" },
        { name: "Olive Oil Pasta", calories: 400, carbs: 55, fat: 15, protein: 12, meal: "Dinner" },
        { name: "Yogurt with Honey and Nuts", calories: 250, carbs: 25, fat: 12, protein: 12, meal: "Breakfast" }
    ],
    paleo: [
        { name: "Scrambled Eggs with Vegetables", calories: 250, carbs: 8, fat: 15, protein: 20, meal: "Breakfast" },
        { name: "Grilled Chicken with Sweet Potato", calories: 350, carbs: 30, fat: 8, protein: 35, meal: "Dinner" },
        { name: "Paleo Salad Bowl", calories: 300, carbs: 20, fat: 18, protein: 25, meal: "Lunch" },
        { name: "Beef and Vegetable Skewers", calories: 400, carbs: 15, fat: 20, protein: 40, meal: "Dinner" },
        { name: "Fruit and Nut Bowl", calories: 200, carbs: 25, fat: 10, protein: 5, meal: "Breakfast" }
    ],
    vegan: [
        { name: "Tofu Scramble", calories: 250, carbs: 10, fat: 12, protein: 20, meal: "Breakfast" },
        { name: "Chickpea Curry", calories: 350, carbs: 50, fat: 10, protein: 18, meal: "Dinner" },
        { name: "Vegan Buddha Bowl", calories: 400, carbs: 60, fat: 12, protein: 15, meal: "Lunch" },
        { name: "Avocado Toast", calories: 250, carbs: 30, fat: 12, protein: 8, meal: "Breakfast" },
        { name: "Lentil Soup", calories: 300, carbs: 45, fat: 5, protein: 18, meal: "Lunch" },
        { name: "Vegan Pasta Primavera", calories: 350, carbs: 55, fat: 8, protein: 12, meal: "Dinner" }
    ],
    vegetarian: [
        { name: "Vegetable Omelet", calories: 280, carbs: 8, fat: 18, protein: 20, meal: "Breakfast" },
        { name: "Cheese and Vegetable Quesadilla", calories: 350, carbs: 35, fat: 15, protein: 18, meal: "Lunch" },
        { name: "Eggplant Parmesan", calories: 400, carbs: 40, fat: 18, protein: 20, meal: "Dinner" },
        { name: "Greek Yogurt Parfait", calories: 200, carbs: 25, fat: 5, protein: 15, meal: "Breakfast" },
        { name: "Caprese Salad", calories: 250, carbs: 10, fat: 18, protein: 12, meal: "Lunch" },
        { name: "Vegetarian Chili", calories: 300, carbs: 40, fat: 8, protein: 15, meal: "Dinner" }
    ]
};

// DOM Elements
const carbsSlider = document.getElementById('carbs-slider');
const fatSlider = document.getElementById('fat-slider');
const proteinSlider = document.getElementById('protein-slider');
const carbsDisplay = document.getElementById('carbs-display');
const fatDisplay = document.getElementById('fat-display');
const proteinDisplay = document.getElementById('protein-display');
const generateBtn = document.getElementById('generate-btn');
const mealPlanResult = document.getElementById('meal-plan-result');
const caloriesInput = document.getElementById('calories-input');
const mealsInput = document.getElementById('meals-input');
const dietSelect = document.getElementById('diet-select');

// Update macro displays when sliders change
carbsSlider.addEventListener('input', (e) => {
    carbsDisplay.textContent = e.target.value + 'g';
});

fatSlider.addEventListener('input', (e) => {
    fatDisplay.textContent = e.target.value + 'g';
});

proteinSlider.addEventListener('input', (e) => {
    proteinDisplay.textContent = e.target.value + 'g';
});

// Generate meal plan
generateBtn.addEventListener('click', () => {
    const calories = parseInt(caloriesInput.value);
    const numMeals = parseInt(mealsInput.value);
    const diet = dietSelect.value;
    const targetCarbs = parseInt(carbsSlider.value);
    const targetFat = parseInt(fatSlider.value);
    const targetProtein = parseInt(proteinSlider.value);

    if (calories < 1000 || calories > 5000) {
        alert('Please enter calories between 1000 and 5000');
        return;
    }

    if (numMeals < 1 || numMeals > 6) {
        alert('Please enter number of meals between 1 and 6');
        return;
    }

    const mealPlan = generateMealPlan(calories, numMeals, diet, targetCarbs, targetFat, targetProtein);
    displayMealPlan(mealPlan);
});

// Generate meal plan algorithm
function generateMealPlan(calories, numMeals, diet, targetCarbs, targetFat, targetProtein) {
    const availableMeals = mealDatabase[diet] || mealDatabase.anything;
    const caloriesPerMeal = Math.floor(calories / numMeals);
    const carbsPerMeal = Math.floor(targetCarbs / numMeals);
    const fatPerMeal = Math.floor(targetFat / numMeals);
    const proteinPerMeal = Math.floor(targetProtein / numMeals);

    const mealPlan = [];
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalProtein = 0;

    // Meal type distribution
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const mealTypeCount = {
        'Breakfast': Math.ceil(numMeals * 0.3),
        'Lunch': Math.ceil(numMeals * 0.4),
        'Dinner': Math.ceil(numMeals * 0.3),
        'Snack': 0
    };

    // Adjust for small number of meals
    if (numMeals <= 2) {
        mealTypeCount['Breakfast'] = 1;
        mealTypeCount['Lunch'] = numMeals > 1 ? 1 : 0;
        mealTypeCount['Dinner'] = 0;
    }

    let mealTypeIndex = 0;
    for (let i = 0; i < numMeals; i++) {
        // Select meal type
        let mealType = mealTypes[mealTypeIndex % mealTypes.length];
        if (mealTypeCount[mealType] <= 0 && i < numMeals - 1) {
            mealTypeIndex++;
            mealType = mealTypes[mealTypeIndex % mealTypes.length];
        }
        if (mealTypeCount[mealType] > 0) {
            mealTypeCount[mealType]--;
        }

        // Find suitable meal
        const suitableMeals = availableMeals.filter(meal => 
            meal.meal === mealType || mealType === 'Snack'
        );

        if (suitableMeals.length === 0) {
            // Fallback to any meal if no specific type found
            const randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
            mealPlan.push({
                ...randomMeal,
                mealNumber: i + 1
            });
            totalCalories += randomMeal.calories;
            totalCarbs += randomMeal.carbs;
            totalFat += randomMeal.fat;
            totalProtein += randomMeal.protein;
        } else {
            const selectedMeal = suitableMeals[Math.floor(Math.random() * suitableMeals.length)];
            mealPlan.push({
                ...selectedMeal,
                mealNumber: i + 1
            });
            totalCalories += selectedMeal.calories;
            totalCarbs += selectedMeal.carbs;
            totalFat += selectedMeal.fat;
            totalProtein += selectedMeal.protein;
        }

        mealTypeIndex++;
    }

    return {
        meals: mealPlan,
        totals: {
            calories: totalCalories,
            carbs: totalCarbs,
            fat: totalFat,
            protein: totalProtein
        },
        targets: {
            calories,
            carbs: targetCarbs,
            fat: targetFat,
            protein: targetProtein
        }
    };
}

// Display meal plan
function displayMealPlan(mealPlan) {
    mealPlanResult.classList.remove('hidden');
    
    let html = '<h3>Your Personalized Meal Plan</h3>';
    
    mealPlan.meals.forEach(meal => {
        html += `
            <div class="meal-item">
                <h4>Meal ${meal.mealNumber}: ${meal.name}</h4>
                <p><strong>Type:</strong> ${meal.meal}</p>
                <p><strong>Calories:</strong> ${meal.calories} | <strong>Carbs:</strong> ${meal.carbs}g | <strong>Fat:</strong> ${meal.fat}g | <strong>Protein:</strong> ${meal.protein}g</p>
            </div>
        `;
    });

    html += `
        <div class="meal-item" style="background-color: #e8f5e9; border-left-color: #4CAF50;">
            <h4>Daily Totals</h4>
            <p><strong>Calories:</strong> ${mealPlan.totals.calories} / ${mealPlan.targets.calories}</p>
            <p><strong>Carbs:</strong> ${mealPlan.totals.carbs}g / ${mealPlan.targets.carbs}g</p>
            <p><strong>Fat:</strong> ${mealPlan.totals.fat}g / ${mealPlan.targets.fat}g</p>
            <p><strong>Protein:</strong> ${mealPlan.totals.protein}g / ${mealPlan.targets.protein}g</p>
        </div>
    `;

    mealPlanResult.innerHTML = html;
    
    // Scroll to result
    mealPlanResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Form validation
caloriesInput.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    if (value < 1000) e.target.value = 1000;
    if (value > 5000) e.target.value = 5000;
});

mealsInput.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    if (value < 1) e.target.value = 1;
    if (value > 6) e.target.value = 6;
});

// Initialize
console.log('Taastee meal planner loaded!');

