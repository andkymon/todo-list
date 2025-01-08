import { Dialog } from './Dialog.js';
import { InputValidator } from '../../Utils/InputValidator.js';
import { InvalidStyling } from '../../Utils/InvalidStyling.js';

export const EditTaskDialog = (function () {
    const editTaskDialog = new Dialog("#edit-task-dialog");
    let projectIndex;
    let taskIndex;

    document.addEventListener("editTaskDialogOpened", (event) => {
        const [name, description, dueDate, projectIndexValue, taskIndexValue] = event.detail;
    
        //Set the project and task indices
        projectIndex = projectIndexValue;
        taskIndex = taskIndexValue;
    
        //Show the dialog and set input values
        editTaskDialog.showDialog();
        setInputValues(name, description, dueDate);
    });

    const editTaskNameInput = document.querySelector("#edit-task-name-input"); 
    const editTaskDescriptionInput = document.querySelector("#edit-task-description-input"); 
    const editTaskDateInput = document.querySelector("#edit-task-date-input"); 

    function setInputValues(taskName, taskDescription, taskDate) {
        editTaskNameInput.value = taskName;
        editTaskDescriptionInput.value = taskDescription;
        editTaskDateInput.value = taskDate;
    }

    function editTask() {
        const editTaskNameInput = document.querySelector("#edit-task-name-input"); 
        const editTaskDescriptionInput = document.querySelector("#edit-task-description-input"); 
        const editTaskDateInput = document.querySelector("#edit-task-date-input"); 

        const name = editTaskNameInput.value;
        const description = editTaskDescriptionInput.value;
        const dueDate = new Date(editTaskDateInput.valueAsNumber); //Convert to ms to instantiate a Date object 

        let inputIsInvalid;
        if (InputValidator.validateName(name) === false) {
            InvalidStyling.showValidationError(editTaskNameInput, "name");
            inputIsInvalid = true;
        }
        if (InputValidator.validateDescription(description) === false) {
            InvalidStyling.showValidationError(editTaskDescriptionInput, "description");
            inputIsInvalid = true;
        }
        if (InputValidator.validateDate(dueDate) === false) {
            InvalidStyling.showValidationError(editTaskDateInput, "date");
            inputIsInvalid = true;
        }
        if (inputIsInvalid === true) return;
    
        document.dispatchEvent(new CustomEvent("taskEdited", { detail: 
            [name, description, dueDate, projectIndex, taskIndex] 
        }));
        editTaskDialog.clearInputs();
        editTaskDialog.hideDialog();
    }

    function init() {
        confirmButtonInitialization();
        enterKeyInitialization();
    }

    function confirmButtonInitialization() {
        const confirmButton = document.querySelector("#edit-task-dialog .confirm"); 
        confirmButton.addEventListener("click", editTask);
    }

    function enterKeyInitialization() {
        editTaskDialog.dialog.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                editTask();
            }
        });
    }

    return {
        init
    }
})();