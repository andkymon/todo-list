import { InvalidStyling } from '../../Utils/InvalidStyling.js';

export class Dialog {
    #dialogSelector
    #transitionTime = 300; //Transition time in ms

    constructor(dialogSelector) {
        this.#dialogSelector = dialogSelector;
        this.dialog = document.querySelector(dialogSelector);
        this.dialog.style.transition = `${this.#transitionTime}ms`;
        this.#addDialogEventListeners();
    }

    showDialog = () => {
        this.dialog.showModal();
        setTimeout(() => { //Wait for dialog to open before transition
            this.dialog.classList.add("open");
        }, 1);
    }

    hideDialog = () => {
        InvalidStyling.clearInvalidStyles();
        this.clearInputs();
        this.dialog.classList.remove("open");
        setTimeout(() => { //Wait for transition before closing dialog
            this.dialog.close();
        }, this.#transitionTime);
    }

    #addDialogEventListeners() {
        this.#addCloseDialogEventListeners();
        this.#enterButtonEventListener();
    }

    #addCloseDialogEventListeners() {
        const closeBtn = document.querySelector(this.#dialogSelector + " .close");
        closeBtn.addEventListener("click", this.hideDialog);

        //Prevent default behavior of escape key
        this.dialog.addEventListener("cancel", (event) => {
            event.preventDefault();
            this.hideDialog();
        });
    }

    #enterButtonEventListener() {    
        //Prevent default behavior of enter key
        this.dialog.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        });
    }

    clearInputs() {
        const allInputsSelector = this.#dialogSelector + " input";
        const allTextareasSelector = this.#dialogSelector + " textarea";
        const inputs = document.querySelectorAll(allInputsSelector + ", " + allTextareasSelector);
        for (const input of inputs) {
            input.value = "";
        }
   }
}