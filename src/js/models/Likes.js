export default class Likes {
    constructor() {
        this.likes = [];
    }
    
    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        // find the item in the array
        const index = this.likes.findIndex(el => el.id === id);
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
}