import { Dialog } from './Dialog.js';
import { InputValidator } from '../Logic/InputValidator.js';
import { InvalidStyling } from './InvalidStyling.js';
import PubSub from 'pubsub-js'

export const TaskDialog = (function () {
    const taskDialog = new Dialog("#task-dialog");
    let projectIndex;

    PubSub.subscribe("taskDialogOpened", (msg, data) => {
        taskDialog.showDialog();
    })
    PubSub.subscribe("navButtonClicked", (msg, selectedNavButtonIndex) => {
        projectIndex = selectedNavButtonIndex;
    });

    function addTask() {
        const taskNameInput = document.querySelector("#task-name-input"); 
        const taskDescriptionInput = document.querySelector("#task-description-input"); 
        const taskDateInput = document.querySelector("#task-date-input"); 

        const name = taskNameInput.value;
        const description = taskDescriptionInput.value;
        const dueDate = new Date(taskDateInput.valueAsNumber); //Convert to ms to instantiate a Date object 

        let inputIsInvalid;
        if (InputValidator.validateName(name) === false) {
            InvalidStyling.showValidationError(taskNameInput, "name");
            inputIsInvalid = true;
        }
        if (InputValidator.validateDescription(description) === false) {
            InvalidStyling.showValidationError(taskDescriptionInput, "description");
            inputIsInvalid = true;
        }
        if (InputValidator.validateDate(dueDate) === false) {
            InvalidStyling.showValidationError(taskDateInput, "date");
            inputIsInvalid = true;
        }
        if (inputIsInvalid === true) return;
    
        PubSub.publish("taskAdded", [name, description, dueDate, projectIndex]);
        taskDialog.clearInputs();
        taskDialog.hideDialog();
    }

    function init() {
        confirmButtonInitialization();
        enterKeyInitialization();
    }

    function confirmButtonInitialization() {
        const confirmButton = document.querySelector("#task-dialog .confirm"); 
        confirmButton.addEventListener("click", addTask);
    }

    function enterKeyInitialization() {
        taskDialog.dialog.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                addTask();
            }
        });
    }

    return {
        init
    }
})();