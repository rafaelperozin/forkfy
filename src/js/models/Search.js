import axios from 'axios';
import { edamamID, edamamKey } from '../config';

export default class Search {
    constructor(query, filters) {
        this.query = query;
        this.filters = filters;
    }

    filtersQuery() {
        let filterParam = '';
        // loop troought the array
        this.filters.forEach(el => {
            // set parameter diet or health
            const param = (el === 'low-carb' || el === 'low-fat' || el == 'balanced' || el === 'high-protein') ? 'diet' : 'health';
            // build url param
            filterParam += `&${param}=${el}`;
        });
            
        return filterParam;
    };

    // if don't work, use crossorigin as a prefix proxy on the url
    async getResults() {
        // use fetch, but axios return directly in JSON
        try {
            console.log(`https://api.edamam.com/search?q=${this.query}&app_id=${edamamID}&app_key=${edamamKey}${this.filtersQuery()}`)
            const res = await axios(`https://api.edamam.com/search?q=${this.query}&app_id=${edamamID}&app_key=${edamamKey}${this.filtersQuery()}`);
            this.result = res.data.hits;
            console.log(this.result);
        } catch (error) {
            alert(`Search: Something went wrong [${error}]`);
        }
    }
}