import { ToDoStorage } from '../logic/ToDoStorage.js';
import { InvalidStyling } from './InvalidStyling.js';
import { NavBar } from './NavBar.js';

export class AddProjectDialog {
    static #addProjectDialog = document.querySelector("#project-dialog");
    static #transitionTime = 300; //animation transition time in ms

    static #showAddProjectDialog = () => {
        this.#addProjectDialog.showModal();
        setTimeout(() => { //Wait for dialog to open before playing animation
            this.#addProjectDialog.classList.add("open");
        }, 1);
    }

    static #hideAddProjectDialog = () => {
        InvalidStyling.clearInvalidStyles();
        this.#addProjectDialog.classList.remove("open");
        setTimeout(() => { //Wait for animation to play before closing dialog
            this.#addProjectDialog.close();
        }, this.#transitionTime);
    }

    static #addProject = () => {
        const projectInputName = document.querySelector("#project-input-name"); 
        const nav = document.querySelector("nav");

        const name = projectInputName.value;
        const result = ToDoStorage.addProject(name);
        if (result === false) {
            InvalidStyling.showNameValidationError();
            return;
        }
        projectInputName.value = "";
        this.#hideAddProjectDialog();
        NavBar.updateProjects(); 
        //Transition
        nav.lastChild.classList.add("removed");
        setTimeout(() => { //Wait for nav.lastChild to be set to the left non-visible area for 1ms before transitioning
            nav.lastChild.classList.remove("removed");;
        }, 1);
    }
    
    static init() {
        this.#addProjectDialog.style.transition = `${this.#transitionTime}ms`;

        const addProjectBtn = document.querySelector("#add-project");
        addProjectBtn.addEventListener("click", this.#showAddProjectDialog);

        const closeBtn = document.querySelector(".close");
        closeBtn.addEventListener("click", this.#hideAddProjectDialog);

        //Prevent default behavior of escape key
        this.#addProjectDialog.addEventListener("cancel", (event) => {
            event.preventDefault();
            this.#hideAddProjectDialog();
        });
        
        const projectConfirmBtn = document.querySelector("#project-dialog .confirm"); 
        projectConfirmBtn.addEventListener("click", this.#addProject);

        //Prevent default behavior of enter key
        this.#addProjectDialog.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.#addProject();
            }
        });
    }
}


