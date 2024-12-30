import { ToDoStorage } from '../Logic/ToDoStorage.js';
import { InvalidStyling } from './InvalidStyling.js';
import { NavBar } from './NavBar.js';

export class ProjectDialog {
    static #projectDialog = document.querySelector("#project-dialog");
    static #transitionTime = 300; //animation transition time in ms

    static #showProjectDialog = () => {
        this.#projectDialog.showModal();
        setTimeout(() => { //Wait for dialog to open before playing animation
            this.#projectDialog.classList.add("open");
        }, 1);
    }

    static #hideProjectDialog = () => {
        InvalidStyling.clearInvalidStyles();
        this.#projectDialog.classList.remove("open");
        setTimeout(() => { //Wait for animation to play before closing dialog
            this.#projectDialog.close();
        }, this.#transitionTime);
    }

    static #addProject = () => {
        const projectInputName = document.querySelector("#project-input-name"); 
        const nav = document.querySelector("nav");

        const name = projectInputName.value;
        const result = ToDoStorage.addProject(name);
        if (result === false) {
            InvalidStyling.showValidationError(projectInputName, "name");
            return;
        }
        projectInputName.value = "";
        this.#hideProjectDialog();
        NavBar.updateProjectDisplay(); 
        //Transition
        nav.lastChild.classList.add("removed");
        setTimeout(() => { //Wait for nav.lastChild to be set to the left non-visible area for 1ms before transitioning
            nav.lastChild.classList.remove("removed");;
        }, 1);
    }
    
    static init() {
        this.#projectDialog.style.transition = `${this.#transitionTime}ms`;

        const addProjectBtn = document.querySelector("#add-project");
        addProjectBtn.addEventListener("click", this.#showProjectDialog);

        const closeBtn = document.querySelector(".close");
        closeBtn.addEventListener("click", this.#hideProjectDialog);

        //Prevent default behavior of escape key
        this.#projectDialog.addEventListener("cancel", (event) => {
            event.preventDefault();
            this.#hideProjectDialog();
        });
        
        const projectConfirmBtn = document.querySelector("#project-dialog .confirm"); 
        projectConfirmBtn.addEventListener("click", this.#addProject);

        //Prevent default behavior of enter key
        this.#projectDialog.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.#addProject();
            }
        });
    }
}


