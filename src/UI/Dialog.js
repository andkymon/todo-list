import { InvalidStyling } from './InvalidStyling.js';

export class Dialog {
    #transitionTime = 300; //Transition time in ms
    #dialog;
    #openDialogButton;

    constructor(dialogSelector, openDialogButtonSelector, confirmButtonFunction) {
        this.#dialog = document.querySelector(dialogSelector);
        this.#openDialogButton = document.querySelector(openDialogButtonSelector);
        this.#dialog.style.transition = `${this.#transitionTime}ms`;
        this.#addDialogEventListeners(confirmButtonFunction); //Instance specific confirm button event handling
    }

    #showDialog = () => {
        this.#dialog.showModal();
        setTimeout(() => { //Wait for dialog to open before transition
            this.#dialog.classList.add("open");
        }, 1);
    }

    hideDialog = () => {
        InvalidStyling.clearInvalidStyles();
        this.#dialog.classList.remove("open");
        setTimeout(() => { //Wait for transition before closing dialog
            this.#dialog.close();
        }, this.#transitionTime);
    }

    #addDialogEventListeners(confirmButtonFunction) {
        this.#addOpenDialogEventListeners();
        this.#addCloseDialogEventListeners();
        this.#confirmDialogEventListeners(confirmButtonFunction);
    }

    #addOpenDialogEventListeners() {
        this.#openDialogButton.addEventListener("click", this.#showDialog);
    }

    #addCloseDialogEventListeners() {
        const closeBtn = document.querySelector(".close");
        closeBtn.addEventListener("click", this.hideDialog);

        //Prevent default behavior of escape key
        this.#dialog.addEventListener("cancel", (event) => {
            event.preventDefault();
            this.hideDialog();
        });
    }

    #confirmDialogEventListeners(confirmButtonFunction) {
        const confirmButton = document.querySelector("#" + this.#dialog.id + " .confirm"); 
        confirmButton.addEventListener("click", confirmButtonFunction);
    
        //Prevent default behavior of enter key
        this.#dialog.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                confirmButtonFunction();
            }
        });
    }
}