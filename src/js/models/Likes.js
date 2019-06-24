export default class Likes {
    constructor() {
        this.likes = [];
    }
    
    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // store on local storage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        // find the item in the array
        const index = this.likes.findIndex(el => el.id === id);

        // remove from local storage
        this.persistData();

        // remove the item from the array
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        // will return true or false
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        console.log(this.likes)
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // restore likes from the localstorage
        if (storage) this.likes = storage;
    }
}