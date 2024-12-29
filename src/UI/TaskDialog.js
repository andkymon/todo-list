import { ToDoStorage } from '../Logic/ToDoStorage.js';
import { InputValidator } from '../Logic/InputValidator.js';
import { InvalidStyling } from './InvalidStyling.js';
import { Main } from './Main.js';
import { NavBar } from './NavBar.js';

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

    static #addTask = () => {
        const projectIndex = NavBar.getSelectedProjectIndex();
        const taskInputName = document.querySelector("#task-input-name"); 
        const taskInputDescription = document.querySelector("#task-input-description"); 
        const taskInputDate = document.querySelector("#task-input-date"); 

        const name = taskInputName.value;
        const description = taskInputDescription.value;
        const dueDate = new Date(taskInputDate.valueAsNumber);

        const result = ToDoStorage.addTask(name, description, dueDate, projectIndex);
        if (result === false) {
            if (InputValidator.validateName(name) === false) {
                InvalidStyling.showValidationError(taskInputName, "name");
            }
            if (InputValidator.validateDescription(description) === false) {
                InvalidStyling.showValidationError(taskInputDescription, "description");
            }
            if (InputValidator.validateDate(dueDate) === false) {
                InvalidStyling.showValidationError(taskInputDate, "date");
            }
            return;
        }
        taskInputName.value = "";
        taskInputDescription.value = "";
        taskInputDate.value = "";
        this.#hideTaskDialog();
        Main.updateTasks(projectIndex); 
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

        const taskConfirmBtn = document.querySelector("#task-dialog .confirm"); 
        taskConfirmBtn.addEventListener("click", this.#addTask);

        //Prevent default behavior of enter key
        this.#taskDialog.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.#addTask();
            }
        });
    }
}


