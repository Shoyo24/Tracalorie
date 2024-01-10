class CalorieTracker {
    constructor() {
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayTotalCalories();
        this._displayCaloriesConsumed();
        this._displayCaloriesRemaining();
        this._displayCaloriesBurned();
        this._displayProgressBar();
        this._render();
    }

    // Public Methods
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calorie;
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calorie;
        this._render();
    }

    // Private Methods
    _displayTotalCalories() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const remaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remaining;
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');
        const consumed = this._meals.reduce((total, meal) => total + meal.calorie,0)
        caloriesConsumedEl.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');
        const burned = this._workouts.reduce((total, workout) => total + workout.calorie,0)
        caloriesBurnedEl.innerHTML = burned;
    }

    _displayProgressBar() {
        const progressBar = document.getElementById('calorie-progress');
        const percentage = (this._calorieLimit / this._totalCalories) * 100;
        const width = Math.min(percentage, 100);

        progressBar.style.width =`${percentage}%`;
        console.log(progressBar);
    }

    _render() {
        this._displayCaloriesConsumed();
        this._displayTotalCalories();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
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

const tracker = new CalorieTracker();

const meal = new Meal('Breakfast', 200);
tracker.addMeal(meal);

const workout = new Workout('Run', 500); 
tracker.addWorkout(workout)
