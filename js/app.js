// App Object
class App {
    constructor() {
        this.calorieTracker = new CalorieTracker();

        // Events
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
        
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this));

        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this));
    }

    // Private Methods
    _newItem(type, e) {
        e.preventDefault();

        const itemName = document.getElementById(`${type}-name`);
        const itemCalories = document.getElementById(`${type}-calories`);
        const itemList = document.getElementById(`${type}-items`);
        
        // Validate
        if(itemName.value === '' || itemCalories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        // Type Check
        if(type === 'meal') {
            const meal = new Meal(itemName.value, parseFloat(itemCalories.value));
            this.calorieTracker.addMeal(meal);
            itemList.appendChild(this._newCard('meal', itemName.value, itemCalories.value));
        }else {
            const workout = new Workout(itemName.value, parseFloat(itemCalories.value));
            this.calorieTracker.addWorkout(workout);
            itemList.appendChild(this._newCard('workout', itemName.value, itemCalories.value));
        }

        // Reset Inputs
        itemName.value = '';
        itemCalories.value = '';
    }

    _newCard(type, name, calories) {
        const newItemCard = document.createElement('div');
        newItemCard.classList = 'card my-2';

        const bgColorClass = (type === 'meal') ? 'bg-primary' : 'bg-secondary';

        newItemCard.innerHTML = 
        `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${name}</h4>
                <div class="fs-1 ${bgColorClass} text-white text-center rounded-2 px-2 px-sm-5">${calories}</div>
                <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        `     

        return newItemCard;
    };

    _removeItem(e) {
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-solid')) {
            const cardToDelete = e.target.closest('.card');
            cardToDelete.remove();
        }
    }

    _setLimit(e) {
        e.preventDefault();

        const limitInput = document.getElementById('limit');

        // Validate
        if(limitInput.value === '' || limitInput.value === '0') {
            alert('Please enter new calorie limit');
            return;
        }else {
            this.calorieTracker.calorieLimit = parseFloat(limitInput.value);
            this.calorieTracker._render();
        }
    }

    _reset(e) {
        e.preventDefault();

        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';

        this.calorieTracker.totalCalorie = 0;
        this.calorieTracker.calorieLimit = 0;
        this.calorieTracker._meals = [];
        this.calorieTracker._workouts = [];
    
        // Update DOM
        this.calorieTracker._render();
    }
}


// Calorie Tracker
class CalorieTracker {
    constructor() {
        this.totalCalorie = 0;
        this.calorieLimit = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCalorieLimit();
        this._displayCaloriesRemaining();
        this._displayTotalCalorie();
        this._displayCaloriesConsumed();
        this._displayCalorieBurned();        
        this._displayProgressBar();
    }

    // Public Methods
    addMeal(meal) {
        this._meals.push(meal);
        this.totalCalorie += meal.calorie;
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this.totalCalorie -= workout.calorie;
        this._render();
    }

    // Private Methods
    _displayCalorieLimit() {
        document.getElementById('calories-limit').innerHTML = this.calorieLimit;
    }

    _displayTotalCalorie() {
        document.getElementById('calories-total').innerHTML = this.totalCalorie;
    }

    _displayCaloriesRemaining() {
        document.getElementById('calories-remaining').innerHTML = this.calorieLimit - this.totalCalorie;
    }

    _displayCaloriesConsumed() {
        const consumed = this._meals.reduce((total, meal) => total + meal.calorie, 0);
        document.getElementById('calories-consumed').innerHTML = consumed;
    }

    _displayCalorieBurned() {
        const burned = this._workouts.reduce((total, workout) => total + workout.calorie, 0);
        document.getElementById('calories-burned').innerHTML = burned;
    }

    _displayProgressBar() {
        const progressBarEl = document.getElementById('calorie-progress');
        const percentage = (this.totalCalorie / this.calorieLimit) * 100;
        const width = Math.min(percentage, 100);

        progressBarEl.style.width = `${width}%`;
    }

    _render() {
        this._displayCalorieLimit();
        this._displayCaloriesRemaining();
        this._displayTotalCalorie();
        this._displayCaloriesConsumed();
        this._displayCalorieBurned();
        this._displayProgressBar();
    }
}

// Meal Object
class Meal {
    constructor(name, calorie) {
        this.name = name;
        this.calorie = calorie;
    }
}

// Workout Object
class Workout {
    constructor(name, calorie) {
        this.name = name;
        this.calorie = calorie;
    }
}

const newApp = new App();
