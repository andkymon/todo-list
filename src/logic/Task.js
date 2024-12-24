import { InputValidator } from './InputValidator.js';

export class Task {
    #name;
    #description;
    #dueDate;
    #isPriority;
    #isComplete;

    constructor(name, description, dueDate) {
        this.#name = name;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#isPriority = false;
        this.#isComplete = false;
    }

    get name() {
        return this.#name;
    }
    set name(str) {
        if (InputValidator.validateName(str) === false) {
            return;
        }
        this.#name = str;
    }

    get description() {
        return this.#description;
    }
    set description(str) {
        if (InputValidator.validateDescription(str) === false) {
            return;
        }
        this.#description = str;
    }

    get dueDate() {
        return this.#dueDate;
    }
    set dueDate(date) {
        if (InputValidator.validateDate(date) === false) {
            return;
        }
        this.#dueDate = date;
    }

    get isPriority() {
        return this.#isPriority;
    }
    set isPriority(bool) {
        if (InputValidator.validateBoolean(bool) === false) {
            return;
        }
        this.#isPriority = bool;
    }

    get isComplete() {
        return this.#isComplete;
    }
    set isComplete(bool) {
        if (InputValidator.validateBoolean(bool) === false) {
            return;
        }
        this.#isComplete = bool;
    }
}