// Onboarding Flow State
let currentStep = 1;
const totalSteps = 7;
const userData = {
    goal: '',
    diet: '',
    activity: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    targetWeight: '',
    mealsPerDay: '',
    avoidFoods: [],
    email: '',
    name: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    setupEventListeners();
    
    // Show target weight field if goal is lose-weight
    const goal = userData.goal;
    if (goal === 'lose-weight') {
        document.getElementById('target-weight-group').style.display = 'block';
    }
});

// Setup Event Listeners
function setupEventListeners() {
    // Single select option cards (Steps 1, 2, 3, 5)
    document.querySelectorAll('.option-card, .option-card-row').forEach(card => {
        card.addEventListener('click', function() {
            const step = this.closest('.onboarding-step');
            const stepId = step.id;
            const value = this.dataset.value;
            
            // Remove selected from siblings
            const siblings = this.parentElement.querySelectorAll('.option-card, .option-card-row');
            siblings.forEach(sibling => sibling.classList.remove('selected'));
            
            // Add selected to this card
            this.classList.add('selected');
            
            // Store data
            if (stepId === 'step-1') {
                userData.goal = value;
                // Show/hide target weight based on goal
                if (value === 'lose-weight') {
                    document.getElementById('target-weight-group').style.display = 'block';
                } else {
                    document.getElementById('target-weight-group').style.display = 'none';
                }
            } else if (stepId === 'step-2') {
                userData.diet = value;
            } else if (stepId === 'step-3') {
                userData.activity = value;
            } else if (stepId === 'step-5') {
                userData.mealsPerDay = value;
            }
            
            // Auto advance after a short delay
            setTimeout(() => {
                const stepNumber = parseInt(stepId.split('-')[1]);
                nextStep(stepNumber);
            }, 300);
        });
    });
    
    // Multi-select cards (Step 6)
    document.querySelectorAll('.multi-option-card').forEach(card => {
        card.addEventListener('click', function() {
            const value = this.dataset.value;
            this.classList.toggle('selected');
            
            // Update userData
            const index = userData.avoidFoods.indexOf(value);
            if (index > -1) {
                userData.avoidFoods.splice(index, 1);
            } else {
                userData.avoidFoods.push(value);
            }
        });
    });
}

// Next Step
function nextStep(stepNumber) {
    if (stepNumber < totalSteps) {
        currentStep = stepNumber + 1;
        showStep(currentStep);
        updateProgress();
    }
}

// Previous Step
function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

// Show Step
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.onboarding-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Show/hide back button
    const backBtn = document.getElementById('back-btn');
    if (stepNumber > 1 && stepNumber <= totalSteps) {
        backBtn.style.display = 'block';
    } else {
        backBtn.style.display = 'none';
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update Progress
function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('current-step').textContent = currentStep;
}

// Validate and Continue (for form steps)
function validateAndContinue(stepNumber) {
    if (stepNumber === 4) {
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const targetWeight = document.getElementById('target-weight').value;
        
        if (!age || !gender || !height || !weight) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (age < 13 || age > 100) {
            alert('Please enter a valid age between 13 and 100');
            return;
        }
        
        if (height < 100 || height > 250) {
            alert('Please enter a valid height');
            return;
        }
        
        if (weight < 30 || weight > 300) {
            alert('Please enter a valid weight');
            return;
        }
        
        // Store data
        userData.age = age;
        userData.gender = gender;
        userData.height = height;
        userData.weight = weight;
        userData.targetWeight = targetWeight || weight;
        
        nextStep(stepNumber);
    }
}

// Generate Plan
function generatePlan() {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Store data
    userData.email = email;
    userData.name = name;
    
    // Show loading state
    showLoadingState();
    
    // Simulate plan generation
    setTimeout(() => {
        completePlanGeneration();
    }, 5000);
}

// Show Loading State
function showLoadingState() {
    document.querySelectorAll('.onboarding-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('loading-step').classList.add('active');
    document.getElementById('back-btn').style.display = 'none';
    
    // Animate loading messages
    const messages = document.querySelectorAll('.loading-message');
    messages.forEach((message, index) => {
        setTimeout(() => {
            messages.forEach(m => m.classList.remove('active'));
            message.classList.add('active');
        }, index * 1000);
    });
}

// Complete Plan Generation
function completePlanGeneration() {
    // Calculate calories based on user data
    const calories = calculateCalories();
    
    // Store user data in localStorage
    localStorage.setItem('taasteeUserData', JSON.stringify(userData));
    localStorage.setItem('taasteeCalories', calories);
    
    // Redirect to main page with meal plan
    window.location.href = `index.html?generated=true&calories=${calories}`;
}

// Calculate Calories (simplified formula)
function calculateCalories() {
    const weight = parseFloat(userData.weight);
    const height = parseFloat(userData.height);
    const age = parseFloat(userData.age);
    const gender = userData.gender;
    
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multiplier
    const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very': 1.725,
        'athlete': 1.9
    };
    
    const tdee = bmr * (activityMultipliers[userData.activity] || 1.2);
    
    // Adjust based on goal
    let targetCalories = tdee;
    if (userData.goal === 'lose-weight') {
        targetCalories = tdee - 500; // 500 calorie deficit
    } else if (userData.goal === 'gain-muscle') {
        targetCalories = tdee + 300; // 300 calorie surplus
    }
    
    // Round to nearest 50
    return Math.round(targetCalories / 50) * 50;
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Handle browser back button
window.addEventListener('popstate', function(event) {
    if (currentStep > 1) {
        previousStep();
    } else {
        window.location.href = 'index.html';
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (currentStep > 1) {
            previousStep();
        }
    }
});

// Prevent form submission on enter
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && event.target.tagName !== 'BUTTON') {
        event.preventDefault();
        
        // Trigger continue button if on form step
        if (currentStep === 4) {
            validateAndContinue(4);
        } else if (currentStep === 7) {
            generatePlan();
        }
    }
});

console.log('Taastee Onboarding initialized!');

