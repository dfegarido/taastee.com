// Onboarding State
let currentStepIndex = 0;
const totalSteps = 28;
const userData = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Option cards and buttons
    document.querySelectorAll('.option-card, .option-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.dataset.value;
            const step = this.closest('.step');
            const stepNumber = step.dataset.step;
            
            // Save data
            userData[`step${stepNumber}`] = value;
            
            // Highlight selection
            step.querySelectorAll('.option-card, .option-button').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Auto advance for single-choice questions
            setTimeout(() => nextStep(), 300);
        });
    });

    // Measurement toggles
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const group = this.parentElement;
            group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle input visibility
            const unit = this.dataset.unit;
            if (unit === 'imperial' || unit === 'lbs') {
                document.querySelectorAll('.imperial-input').forEach(el => el.style.display = 'flex');
                document.querySelectorAll('.metric-input').forEach(el => el.style.display = 'none');
            } else {
                document.querySelectorAll('.imperial-input').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.metric-input').forEach(el => el.style.display = 'flex');
            }
            
            // Update weight unit display
            if (this.dataset.unit === 'lbs' || this.dataset.unit === 'kg') {
                const units = document.querySelectorAll('#weightUnit, #targetWeightUnit');
                units.forEach(unit => unit.textContent = this.dataset.unit);
            }
        });
    });

    // Handle "none" checkbox
    document.querySelectorAll('input[value="none"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const checkboxes = this.closest('.checkbox-list').querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });

    // Handle other checkboxes (uncheck "none" if any other is checked)
    document.querySelectorAll('.checkbox-list input[type="checkbox"]:not([value="none"])').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const noneCheckbox = this.closest('.checkbox-list').querySelector('input[value="none"]');
                if (noneCheckbox) noneCheckbox.checked = false;
            }
        });
    });
}

// Navigate to next step
function nextStep() {
    const currentStep = document.querySelector(`.step[data-step="${currentStepIndex}"]`);
    
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Hide current step
    currentStep.classList.remove('active');
    
    // Show next step
    currentStepIndex++;
    const nextStep = document.querySelector(`.step[data-step="${currentStepIndex}"]`);
    
    if (nextStep) {
        nextStep.classList.add('active');
        updateProgress();
        
        // Show/hide back button
        const backBtn = document.getElementById('backBtn');
        backBtn.style.display = currentStepIndex > 0 ? 'inline-block' : 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Navigate to previous step
function previousStep() {
    if (currentStepIndex > 0) {
        // Hide current step
        document.querySelector(`.step[data-step="${currentStepIndex}"]`).classList.remove('active');
        
        // Show previous step
        currentStepIndex--;
        const prevStep = document.querySelector(`.step[data-step="${currentStepIndex}"]`);
        prevStep.classList.add('active');
        
        updateProgress();
        
        // Hide back button on first step
        if (currentStepIndex === 0) {
            document.getElementById('backBtn').style.display = 'none';
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentStepIndex + 1) / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // Update header step counter
    const headerStep = document.getElementById('headerStep');
    const headerTotal = document.getElementById('headerTotal');
    if (headerStep) headerStep.textContent = currentStepIndex + 1;
    if (headerTotal) headerTotal.textContent = totalSteps;
}

// Validate step
function validateStep(step) {
    const stepNumber = step.dataset.step;
    
    // Check for required inputs
    const inputs = step.querySelectorAll('input.input-field[type="number"], input.input-field[type="email"]');
    for (let input of inputs) {
        if (input.offsetParent !== null && !input.value) { // visible and empty
            input.focus();
            input.style.borderColor = '#ff6b35';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
            return false;
        }
    }
    
    // Save input data
    inputs.forEach(input => {
        if (input.value) {
            userData[input.id] = input.value;
        }
    });
    
    // Save checkbox data
    const checkboxes = step.querySelectorAll('input[type="checkbox"]:checked');
    if (checkboxes.length > 0) {
        userData[`step${stepNumber}`] = Array.from(checkboxes).map(cb => cb.value);
    }
    
    return true;
}

// Submit onboarding
async function submitOnboarding() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    
    // Validate first name
    if (!firstName.value || firstName.value.trim() === '') {
        firstName.focus();
        firstName.style.borderColor = '#2d6a5c';
        return;
    }
    
    // Validate last name
    if (!lastName.value || lastName.value.trim() === '') {
        lastName.focus();
        lastName.style.borderColor = '#2d6a5c';
        return;
    }
    
    // Validate email
    if (!email.value || !email.value.includes('@')) {
        email.focus();
        email.style.borderColor = '#2d6a5c';
        return;
    }
    
    // Validate checkbox agreement
    if (!agreeCheckbox.checked) {
        alert('Please agree to the terms by checking the box before submitting.');
        agreeCheckbox.focus();
        return;
    }
    
    userData.firstName = firstName.value.trim();
    userData.lastName = lastName.value.trim();
    userData.email = email.value;
    
    // Store data locally
    localStorage.setItem('taasteeUserData', JSON.stringify(userData));
    
    // Log user data
    console.log('User Data:', userData);
    
    // Submit to JotForm
    try {
        await submitToJotForm(userData);
        
        // Hide header, progress bar, and navigation buttons
        document.querySelector('.onboarding-header').style.display = 'none';
        document.querySelector('.progress-container').style.display = 'none';
        document.querySelector('.navigation-buttons').style.display = 'none';
        
        // Hide current step
        document.querySelector('.step.active').classList.remove('active');
        
        // Show confirmation screen
        const confirmationScreen = document.querySelector('[data-step="28"]');
        confirmationScreen.classList.add('active');
        
    } catch (error) {
        console.error('Error submitting to JotForm:', error);
        alert('There was an error submitting your information. Please try again.');
    }
}

// Submit data to JotForm
async function submitToJotForm(data) {
    // Your JotForm Form ID
    const JOTFORM_FORM_ID = '253378588290067';
    
    console.log('Submitting to JotForm with data:', data);
    
    // Create form submission - JotForm expects standard form encoding
    const formData = new URLSearchParams();
    
    // Required fields
    formData.append('formID', JOTFORM_FORM_ID);
    
    // Personal Information
    if (data.firstName) formData.append('q3_firstName', data.firstName);
    if (data.lastName) formData.append('q4_lastName', data.lastName);
    if (data.email) formData.append('q5_email', data.email);
    
    // Biological Sex (step 0)
    if (data.step0) {
        // Convert to match JotForm values: "female" -> "Female", "male" -> "Male"
        const sex = data.step0.charAt(0).toUpperCase() + data.step0.slice(1);
        formData.append('q6_biologicalSex', sex);
    }
    
    // Age
    if (data.age) formData.append('q7_age', data.age);
    
    // Height with unit (e.g., "161 cm")
    if (data.heightCm) {
        formData.append('q40_height40', `${data.heightCm} cm`);
    }
    
    // Current Weight with unit (e.g., "56 kg")
    if (data.currentWeight) {
        formData.append('q41_currentWeight', `${data.currentWeight} kg`);
    }
    
    // Target Weight with unit (e.g., "60 kg")
    if (data.targetWeight) {
        formData.append('q42_targetWeight', `${data.targetWeight} kg`);
    }
    
    // Primary Goal (step 1)
    if (data.step1) {
        const goalMap = {
            'lose': 'Lose weight',
            'maintain': 'Maintain weight',
            'gain': 'Gain muscle',
            'health': 'Improve health'
        };
        formData.append('q16_primaryGoal', goalMap[data.step1] || data.step1);
    }
    
    // Activity Level (step 6)
    if (data.step6) {
        const activityMap = {
            'sedentary': 'Sedentary (little or no exercise)',
            'light': 'Lightly Active(1-3 days/week)',
            'moderate': 'Moderately Active(3-5 days/week)',
            'very': 'Very Active(6-7 days/week)',
            'extra': 'Extra Active(Very hard exercise & physical job)'
        };
        formData.append('q17_activityLevel', activityMap[data.step6] || data.step6);
    }
    
    // Diet Type (step 7)
    if (data.step7) {
        const dietMap = {
            'balanced': 'Balanced (Everything)',
            'keto': 'Keto (Low carb, high fat)',
            'vegan': 'Vegan (Plant-based)',
            'vegetarian': 'Vegetarian',
            'paleo': 'Paleo (Whole foods)',
            'mediterranean': 'Mediterranean'
        };
        formData.append('q18_diertType', dietMap[data.step7] || data.step7);
    }
    
    // Meals Per Day (step 8)
    if (data.step8) formData.append('q19_mealsPer', data.step8);
    
    // Cooking Time (step 9)
    if (data.step9) {
        const timeMap = {
            '15': '15 minutes or less',
            '30': '30 minutes',
            '45': '45 minutes',
            '60': '1 hour or more'
        };
        formData.append('q20_cookingTime', timeMap[data.step9] || data.step9);
    }
    
    // Food Allergies (step 10) - checkboxes
    if (Array.isArray(data.step10) && data.step10.length > 0) {
        data.step10.forEach(allergy => {
            const allergyMap = {
                'nuts': 'Nuts',
                'dairy': 'Dairy',
                'eggs': 'Eggs',
                'shellfish': 'Shellfish',
                'soy': 'Soy',
                'gluten': 'Gluten',
                'none': 'No allergies'
            };
            formData.append('q21_foodAllergies[]', allergyMap[allergy] || allergy);
        });
    }
    
    // Food Dislikes (step 11) - checkboxes
    if (Array.isArray(data.step11) && data.step11.length > 0) {
        data.step11.forEach(dislike => {
            const dislikeMap = {
                'fish': 'Fish & Seafood',
                'beef': 'Beef',
                'pork': 'Pork',
                'chicken': 'Chicken',
                'spicy': 'Spicy foods',
                'mushrooms': 'Mushrooms',
                'none': 'No dislikes'
            };
            formData.append('q22_foodDislikes[]', dislikeMap[dislike] || dislike);
        });
    }
    
    // Cooking Experience (step 12)
    if (data.step12) {
        const expMap = {
            'beginner': 'Beginner - Simple recipe only',
            'intermediate': 'Intermediate - Can handle most recipes',
            'advanced': 'Advanced - Love Challenged!'
        };
        formData.append('q23_cookingExperience', expMap[data.step12] || data.step12);
    }
    
    // Meal Prep (step 13)
    if (data.step13) {
        const prepMap = {
            'yes': 'Yes, I meal prep for the week',
            'sometimes': 'Sometimes, depends on the week',
            'no': 'No, I cook fresh daily'
        };
        formData.append('q24_mealPrep', prepMap[data.step13] || data.step13);
    }
    
    // Budget (step 14)
    if (data.step14) {
        const budgetMap = {
            'low': 'Budget-friendly ($50-$75/week)',
            'medium': 'Moderate ($75-$125/week)',
            'high': 'Premium ($125+/week)',
            'flexible': 'Flexible (Quality matters most)'
        };
        formData.append('q25_weeklyGrocery', budgetMap[data.step14] || data.step14);
    }
    
    // Household Size (step 15)
    if (data.step15) formData.append('q26_householdSize', data.step15);
    
    // Include Snacks (step 16)
    if (data.step16) {
        const snackMap = {
            'yes': 'Yes',
            'no': 'No'
        };
        formData.append('q27_includeSnacks', snackMap[data.step16] || data.step16);
    }
    
    // Breakfast Type (step 17)
    if (data.step17) {
        const breakfastMap = {
            'quick': 'Quick & Simple (5-10 min)',
            'hearty': 'Hearty & Cooked (15-20 min)',
            'smoothie': 'Smoothies & Drinks',
            'skip': 'I skip breakfast'
        };
        formData.append('q28_breakfastType', breakfastMap[data.step17] || data.step17);
    }
    
    // Protein Preference (step 18)
    if (data.step18) {
        const proteinMap = {
            'chicken': 'Chicken',
            'fish': 'Fish & Seafood',
            'beef': 'Beef',
            'plant': 'Plant-based proteins',
            'variety': 'Variety - Mix it up!'
        };
        formData.append('q29_proteinPreference', proteinMap[data.step18] || data.step18);
    }
    
    // Kitchen Equipment (step 19) - checkboxes
    if (Array.isArray(data.step19) && data.step19.length > 0) {
        data.step19.forEach(equipment => {
            const equipMap = {
                'oven': 'Oven',
                'microwave': 'Microwave',
                'airfryer': 'Air Fryer',
                'slowcooker': 'Slow Cooker',
                'instantpot': 'Instant Pot',
                'blender': 'Blender',
                'grill': 'Grill'
            };
            formData.append('q30_kitchenEquipment[]', equipMap[equipment] || equipment);
        });
    }
    
    // Leftovers Preference (step 20)
    if (data.step20) {
        const leftoverMap = {
            'love': 'Love them - saves time!',
            'okay': "They're okay for 1-2 days",
            'fresh': 'Prefer fresh meals every time'
        };
        formData.append('q31_leftoversPreference', leftoverMap[data.step20] || data.step20);
    }
    
    // Water Intake (step 21)
    if (data.step21) {
        const waterMap = {
            'low': 'Less than 4 glasses',
            'medium': '4-6 glasses',
            'good': '7-8 glasses (recommended)',
            'high': 'More than 8 glasses'
        };
        formData.append('q32_dailyWater', waterMap[data.step21] || data.step21);
    }
    
    // Sleep Quality (step 22)
    if (data.step22) {
        const sleepMap = {
            'poor': 'Poor - often feel tired',
            'okay': 'Okay - Could be better',
            'good': 'Good - usually well-rested',
            'excellent': 'Execellent - sleep like baby'
        };
        formData.append('q33_sleepQuality', sleepMap[data.step22] || data.step22);
    }
    
    // Health Conditions (step 23) - checkboxes
    if (Array.isArray(data.step23) && data.step23.length > 0) {
        data.step23.forEach(condition => {
            const conditionMap = {
                'diabetes': 'Diabetes',
                'hypertension': 'High Blood Pressure',
                'cholesterol': 'High Cholesterol',
                'thyroid': 'Thyroid Issues',
                'ibs': 'IBS / Digestive Issues',
                'none': 'None'
            };
            formData.append('q34_healthConditions[]', conditionMap[condition] || condition);
        });
    }
    
    // Motivation (step 24)
    if (data.step24) {
        const motivationMap = {
            'health': 'Better health & energy',
            'appearance': 'Look and feel better',
            'confidence': 'Boost confidence',
            'lifestyle': 'Sustainable lifestyle change'
        };
        formData.append('q35_primaryMotivation', motivationMap[data.step24] || data.step24);
    }
    
    // Previous Diets (step 25)
    if (data.step25) {
        const dietExpMap = {
            'never': 'Never -  this is my first time',
            'few': "Tried a few, didn't stick",
            'many': 'Many times, looking for what works',
            'success': 'Had success, maintaining now'
        };
        formData.append('q36_previousDiet', dietExpMap[data.step25] || data.step25);
    }
    
    // Start Date (step 26)
    if (data.step26) {
        const startMap = {
            'today': "Today - I'm ready!",
            'tomorrow': 'Tomorrow',
            'monday': 'Next Monday',
            'later': 'Within the next 2 weeks'
        };
        formData.append('q37_startDate', startMap[data.step26] || data.step26);
    }
    
    // Consent Checkbox - exact value from JotForm (with non-breaking spaces)
    formData.append('q38_consentCheckbox[]', 'I agree to receive my\u00A0personalized meal plan and occasional promotional communications\u00A0via email');
    
    // Anti-spam field (should be empty)
    formData.append('website', '');
    
    console.log('FormData being sent:', Object.fromEntries(formData));
    
    // Submit to JotForm
    try {
        const response = await fetch(`https://submit.jotform.com/submit/${JOTFORM_FORM_ID}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        
        console.log('JotForm response status:', response.status);
        
        if (response.ok || response.type === 'opaque') {
            console.log('Form submitted successfully!');
            return response;
        } else {
            console.error('Form submission failed with status:', response.status);
            const text = await response.text();
            console.error('Response text:', text);
            throw new Error(`Failed to submit to JotForm: ${response.status}`);
        }
    } catch (error) {
        console.error('Error submitting to JotForm:', error);
        throw error;
    }
}

// Add selected state styles
const style = document.createElement('style');
style.textContent = `
    .option-card.selected,
    .option-button.selected {
        border-color: #ff6b35 !important;
        background: #fff5f0 !important;
    }
`;
document.head.appendChild(style);
