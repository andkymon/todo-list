import { InputValidator } from '../Utils/InputValidator.js';

export class Project {
    #name;
    
    constructor(name) {
        this.#name = name;
    }

    tasks = [];

    get name() {
        return this.#name;
    }
    set name(string) {
        if (InputValidator.validateName(string) === false) {
            return;
        }
        this.#name = string;
    }
}