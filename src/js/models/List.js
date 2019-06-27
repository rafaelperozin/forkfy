import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        // return true when ingredient is not in the current list
        const noIngredient = this.items.findIndex(el => el.ingredient === item.ingredient) === -1 ? true : false;
        if (noIngredient) {
            // if no match ingredient on list
            this.items.push(item);
            return item;
        } else {
            // if ingredient already in the shopping list
            console.log('increase quantity for existent item')
        }
    }

    deleteItem(id) {
        // discover where the current id is locate
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,8] splice(1, 2) -> return [4,8], original array is [2]
        // [2,4,8] slice(1, 2) -> return 4, original array is [2,4,8]
        // remove item from the array
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        // loop in array and count all ids
        this.items.find(el => el.id === id).count = newCount;
    }
}