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
    set name(string) {
        if (InputValidator.validateName(string) === false) {
            return;
        }
        this.#name = string;
    }

    get description() {
        return this.#description;
    }
    set description(string) {
        if (InputValidator.validateDescription(string) === false) {
            return;
        }
        this.#description = string;
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
    set isPriority(boolean) {
        if (InputValidator.validateBoolean(boolean) === false) {
            return;
        }
        this.#isPriority = boolean;
    }

    get isComplete() {
        return this.#isComplete;
    }
    set isComplete(boolean) {
        if (InputValidator.validateBoolean(boolean) === false) {
            return;
        }
        this.#isComplete = boolean;
    }
}