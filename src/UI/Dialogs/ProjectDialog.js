import { Dialog } from './Dialog.js';
import { InputValidator } from '../../Utils/InputValidator.js';
import { InvalidStyling } from '../../Utils/InvalidStyling.js';

export const ProjectDialog = (function () {
    const projectDialog = new Dialog("#project-dialog");
    //Show dialog when a button triggers this event
    document.addEventListener("projectDialogOpened", () => {
        projectDialog.showDialog();
    });

    function addProject() {
        const projectNameInput = document.querySelector("#project-name-input"); 
        const name = projectNameInput.value;
        
        if (InputValidator.validateName(name) === false) {
            InvalidStyling.showValidationError(projectNameInput, "name");
            return;
        }
        //Publish topic for ToDoStorage to add a new project using the input value
        document.dispatchEvent(new CustomEvent("projectAdded", { detail: name }));
        projectDialog.clearInputs();
        projectDialog.hideDialog();
    }

    function init() {
        confirmButtonInitialization();
        enterKeyInitialization();
    }

    function confirmButtonInitialization() {
        const confirmButton = document.querySelector("#project-dialog .confirm"); 
        confirmButton.addEventListener("click", addProject);
    }

    function enterKeyInitialization() {
        projectDialog.dialog.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                addProject();
            }
        });
    }

    //Add specific methods to projectDialog instance
    projectDialog.init = init;

    return projectDialog;
})();
   
    
    







