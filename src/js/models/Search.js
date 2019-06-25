import axios from 'axios';
import { edamamID, edamamKey } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
        // ! recive extra filters
    }

    // if don't work, use crossorigin as a prefix proxy on the url
    async getResults() {
        // use fetch, but axios return directly in JSON
        try {
            const res = await axios(`https://api.edamam.com/search?q=${this.query}&app_id=${edamamID}&app_key=${edamamKey}${extraFilters}`);
            this.result = res.data.hits;
            console.log(this.result);
        } catch (error) {
            alert(`Search: Something went wrong [${error}]`);
        }
    }
}