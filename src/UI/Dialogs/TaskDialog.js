import { Dialog } from './Dialog.js';
import { InputValidator } from '../../Utils/InputValidator.js';
import { InvalidStyling } from '../../Utils/InvalidStyling.js';

export const TaskDialog = (function () {
    const taskDialog = new Dialog("#task-dialog");
    let projectIndex;

    //Show dialog when a button triggers this event
    document.addEventListener("taskDialogOpened", () => {
        taskDialog.showDialog();
    });
    document.addEventListener("navButtonClicked", (event) => {
        const selectedNavButtonIndex = event.detail;
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
    
        document.dispatchEvent(new CustomEvent("taskAdded", {
            detail:[name, description, dueDate, projectIndex]
        }));
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