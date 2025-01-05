import { Dialog } from './Dialog.js';
import { InputValidator } from '../Logic/InputValidator.js';
import { InvalidStyling } from './InvalidStyling.js';
import PubSub from 'pubsub-js'

export const ProjectDialog = (function () {
    const projectDialog = new Dialog("#project-dialog");

    PubSub.subscribe("projectDialogOpened", (msg, data) => {
        projectDialog.showDialog();
    })

    function addProject() {
        const projectNameInput = document.querySelector("#project-name-input"); 
        const name = projectNameInput.value;
        
        if (InputValidator.validateName(name) === false) {
            InvalidStyling.showValidationError(projectNameInput, "name");
            return;
        }
        PubSub.publish("projectAdded", name);
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
   
    
    







