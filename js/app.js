class App {
    constructor() {
        this._newTracker = new CalorieTracker();
    
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));

        document.getElementById('meal-items').addEventListener('click', this._removeMeal.bind(this, 'meal'));
    }

    _newItem(type, e) {
        e.preventDefault();

        const itemName = document.getElementById(`${type}-name`);
        const itemCalories = document.getElementById(`${type}-calories`);
        const itemList = document.getElementById(`${type}-items`)

        // Validate
        if(itemName.value === '' || itemCalories.value === '') {
            alert('Please fill in all fields');
            return;
        }

        // Type check
        if(type === 'meal') {
            const newMeal = new Meal(itemName.value, +itemCalories.value);
            this._newTracker.addMeal(newMeal);
            this._newTracker._displayNewItem(itemName.value, +itemCalories.value, itemList, 'meal', newMeal.id);
        }else {
            const newWorkout = new Workout(itemName.value, +itemCalories.value);
            this._newTracker.addWorkout(newWorkout);
            this._newTracker._displayNewItem(itemName.value, +itemCalories.value, itemList, 'workout', newWorkout.id);
        }

        // Item Value reset
        itemName.value = '';
        itemCalories.value = '';
    }

    _removeMeal(type, e) {
        if(e.target.classList.contains('delete') || e.target.classList.contains('f-xmark')) {
            const card = e.target.closest('.card').getAttribute('data-item-id');
            console.log(card);
        }

        type === 'meal'
            ? this._newTracker.removeMeal()
            : this._newTracker.removeWorkout();
            
        e.target.closest('.card').remove();
    }
    

    _setLimit(e) {
        e.preventDefault();

        const limitEl = document.getElementById('limit');

        // Validate
        if(limitEl.value === '' || limitEl.value === '0') {
            alert('Please enter a valid limit');
            return;
        }else {
            this._newTracker.setLimit(+limitEl.value);
        }
    }

    _reset() {
        this._newTracker.resetDay();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
    }
}

class CalorieTracker {
    constructor() {
        this.totalCalorie = 0;
        this.calorieLimit = 2000;
        this._meals = [];
        this._workouts = [];       

        this._displayTotalCalorie()
        this._displayCalorieBurned();
        this._displayCalorieConsumed();
        this._displayCalorieLimit();
        this._displayCalorieRemaining();
        this._displayCalorieProgress();
    }

    // Public Method
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

    setLimit(newLimit) {
        this.calorieLimit = newLimit;
        this._render();
    }

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);
        console.log(id);
    }
    

    removeWorkout() {
        console.log('removeWorkout');
    }

    resetDay() {
        this.totalCalorie = 0;
        this.calorieLimit = 0;
        this._meals = [];
        this._workouts = [];
        this._render();
    }

    // Private Method
    _displayTotalCalorie() {
        document.getElementById('calories-total').innerHTML = this.totalCalorie;
    }

    _displayCalorieLimit() {
        document.getElementById('calories-limit').innerHTML = this.calorieLimit;
    }

    _displayCalorieRemaining() {
        const calorieRemainingEl = document.getElementById('calories-remaining');
        const remainingElParent = calorieRemainingEl.parentElement.parentElement;
        const remaining = calorieRemainingEl.value;
    
        if(remaining <= 0) {
            remainingElParent.classList.remove('bg-light');
            remainingElParent.classList.add('bg-danger');
        }else {
            remainingElParent.classList.remove('bg-danger');
            remainingElParent.classList.add('bg-light');
        }
    }

    _displayCalorieConsumed() {
        const consumed = this._meals.reduce((total, meal) => total + meal.calorie, 0);
        document.getElementById('calories-consumed').innerHTML = consumed;
    }

    _displayCalorieBurned() {
        const burned = this._workouts.reduce((total, workout) => total + workout.calorie, 0);
        document.getElementById('calories-burned').innerHTML = burned;
    }

    _displayCalorieProgress() {
        const calorieProgressEl = document.getElementById('calorie-progress');
        const percentage = (this.totalCalorie / this.calorieLimit) * 100;
        const width = Math.min(percentage, 100);

        calorieProgressEl.style.width = `${width}%`
    }

    _displayNewItem(itemName, itemCalories, items, type, id) {
        const newItemCard = document.createElement('div');
        newItemCard.dataset.itemId = id;
        const color = (type === 'meal') ? 'bg-primary' : 'bg-secondary';
        newItemCard.classList = 'card my-2';
        newItemCard.innerHTML =
        `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${itemName}</h4>
                <div class="fs-1 ${color} text-white text-center rounded-2 px-2 px-sm-5">${itemCalories}</div>
                <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        `;

        items.appendChild(newItemCard);
    }

    _render() {
        this._displayTotalCalorie()
        this._displayCalorieBurned();
        this._displayCalorieConsumed();
        this._displayCalorieLimit();
        this._displayCalorieRemaining();
        this._displayCalorieProgress();
    }
}

class Meal {
    constructor(name, calorie) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calorie = calorie;
    }
}

class Workout {
    constructor(name, calorie) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calorie = calorie;
    }
}

const app = new App();

