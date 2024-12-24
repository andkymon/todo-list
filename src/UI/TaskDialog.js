import { InvalidStyling } from './InvalidStyling.js';

export class TaskDialog {
    static #taskDialog = document.querySelector("#task-dialog");
    static #transitionTime = 300; //animation transition time in ms

    static #showTaskDialog = () => {
        this.#taskDialog.showModal();
        setTimeout(() => { //Wait for dialog to open before playing animation
            this.#taskDialog.classList.add("open");
        }, 1);
    }

    static #hideTaskDialog = () => {
        InvalidStyling.clearInvalidStyles();
        this.#taskDialog.classList.remove("open");
        setTimeout(() => { //Wait for animation to play before closing dialog
            this.#taskDialog.close();
        }, this.#transitionTime);
    }
    
    static init() {
        this.#taskDialog.style.transition = `${this.#transitionTime}ms`;

        const addTaskBtn = document.querySelector("#add-task");
        addTaskBtn.addEventListener("click", this.#showTaskDialog);

        const closeBtn = document.querySelector("#task-dialog .close");
        closeBtn.addEventListener("click", this.#hideTaskDialog);

        //Prevent default behavior of escape key
        this.#taskDialog.addEventListener("cancel", (event) => {
            event.preventDefault();
            this.#hideTaskDialog();
        });
    }
}


