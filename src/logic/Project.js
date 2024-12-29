import { InputValidator } from './InputValidator.js';

export class Project {
    #name;

    constructor(name) {
        this.#name = name;
    }

    tasks = [];

    get name() {
        return this.#name;
    }
    
    set name(name) {
        if (InputValidator.validateName(name) === false) {
            return;
        }
        this.#name = name;
    }
}