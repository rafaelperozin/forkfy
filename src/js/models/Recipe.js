import axios from 'axios';
import { edamamID, edamamKey } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://api.edamam.com/search?r=${encodeURIComponent(this.id)}&app_id=${edamamID}&app_key=${edamamKey}`);
            console.log(res.data[0])
            this.title = res.data[0].label;
            this.author = res.data[0].source;
            this.img = res.data[0].image;
            this.url = res.data[0].url;
            this.ingredients = res.data[0].ingredients;
        } catch (error) {
            alert(`Recipe: #2 Error building [${error}]`);
        }
    }

    calcTime() {
        // Assuming that we need 15min. for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ouce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const nnewIngredients = this.ingredients.map(el => {
            
            // 1) Uniform units
            console.log(el.text)
            let ingredient = el.text.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            
            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            // indexOf doesn't work because I don't now which unit I'm looking for
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {

                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex); // ex: 4 1/2 cups, this count [4, 1/2]

                let count;
                if (arrCount.length === 1) {
                    // eval('4+1/2') --> 4.5
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    // eval('4+1/2') --> 4.5
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {

                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                
                // The is NO unit and NO number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient // auto create with the same name because we already have this variable set
                }

            }

            return objIng;
        });
        this.ingredients = nnewIngredients;
    }

    updateServings(type) {

        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        // ing is the current value on the forEach loop
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;

    }
}