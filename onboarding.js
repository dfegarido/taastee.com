// Onboarding State
let currentStepIndex = 0;
const totalSteps = 27;
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
function submitOnboarding() {
    const email = document.getElementById('email');
    
    if (!email.value || !email.value.includes('@')) {
        email.focus();
        email.style.borderColor = '#ff6b35';
        return;
    }
    
    userData.email = email.value;
    
    // Store data
    localStorage.setItem('taasteeUserData', JSON.stringify(userData));
    
    // Redirect to offer page or dashboard
    console.log('User Data:', userData);
    window.location.href = 'offer.html'; // Or wherever you want to send them
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
