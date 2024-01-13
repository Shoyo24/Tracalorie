class App {
    constructor() {
        this.calorieTracker = new CalorieTracker();

        // Event Listeners
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
        
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    
        document.getElementById('reset').addEventListener('click', this._resetDay.bind(this));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
    }

    _newItem(type, e) {
        e.preventDefault();

        const itemName = document.getElementById(`${type}-name`);
        const itemCalories = document.getElementById(`${type}-calories`);
        const itemList = document.getElementById(`${type}-items`);

        // Validate
        if(itemName.value === '' || itemCalories.value === '') {
            alert('Please fill in all fields.');
            return;
        }

        // Type check
        if(type === 'meal') {
            const mealObject = new Meal(itemName.value, parseFloat(itemCalories.value));
            this.calorieTracker.addMeal(mealObject);
            itemList.appendChild(this._newListItem(itemName.value, itemCalories.value, type));
        }else {
            const workoutObject = new Workout(itemName.value, parseFloat(itemCalories.value));
            this.calorieTracker.addWorkout(workoutObject);
            itemList.appendChild(this._newListItem(itemName.value, itemCalories.value, type));
        }

        // Reset Input
        itemName.value = '';
        itemCalories.value = '';
    }

    _newListItem(itemName, itemCalorie, type) {
        const cardDiv = document.createElement('div');
        const cardColor = (type === 'meal') ? 'bg-primary' : 'bg-secondary';        

        cardDiv.classList = 'card my-2';
        cardDiv.innerHTML = 
        `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${itemName}</h4>
                <div class="fs-1 ${cardColor} text-white text-center rounded-2 px-2 px-sm-5">${itemCalorie}</div>
                <button class="delete btn btn-danger btn-sm mx-2"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>
        `

        return cardDiv;
    }
    
    _setLimit(e) {
        e.preventDefault();

        const limitEl = document.getElementById('limit');

        this.calorieTracker.calorieLimit = limitEl.value;
        this.calorieTracker._displayCalorieLimit();
        this.calorieTracker._displayCaloriesRemaining();
        
        // Reset Input
        limitEl.value = '';
    }

    _resetDay() {
        this.calorieTracker.calorieLimit = 0;
        this.calorieTracker.totalCalorie = 0;
        this.calorieTracker._meals = [];
        this.calorieTracker._workouts = [];

        this.calorieTracker._render();
    }

    _removeItem(type, e) {
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')){
            const id = e.target.closest('.card');
            

            // type === 'meal' ? 
            // this.calorieTracker.removeMeal() : 
            // this.calorieTracker.removeWorkout();
        }
    }
}

//  BLUEPRINT
class CalorieTracker {
    constructor() {
        this.totalCalorie = 0;
        this.calorieLimit = 0;
        this._meals = [];
        this._workouts = [];

        // Load DOM
        this._displayTotalCalorie();
        this._displayCalorieLimit();
        this._displayCaloriesRemaining();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
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
    _displayTotalCalorie() {
        document.getElementById('calories-total').innerHTML = this.totalCalorie;
    }

    _displayCalorieLimit() {
        document.getElementById('calories-limit').innerHTML = this.calorieLimit;
    }

    _displayCaloriesRemaining() {
        document.getElementById('calories-remaining').innerHTML = this.calorieLimit - this.totalCalorie;
    }

    _displayCaloriesConsumed() {
        const consumed = this._meals.reduce((total, meal) => total + meal.calorie, 0);
        document.getElementById('calories-consumed').innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const burned = this._workouts.reduce((total, workout) => total + workout.calorie, 0);
        document.getElementById('calories-burned').innerHTML = burned;
    }

    _displayProgressBar() {
        const width = Math.min(((this.totalCalorie / this.calorieLimit) * 100), 100);
        document.getElementById('calorie-progress').style.width = `${width}%`;
    }

    _render() {
        this._displayTotalCalorie();
        this._displayCalorieLimit();
        this._displayCaloriesRemaining();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayProgressBar();
    }
}

class Meal {
    constructor(name, calorie) {
        this.name = name;
        this.calorie = calorie;
    }
}

class Workout {
    constructor(name, calorie) {
        this.name = name;
        this.calorie = calorie;
    }
}

const app = new App();
