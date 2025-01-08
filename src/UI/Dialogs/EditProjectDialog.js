import { Dialog } from './Dialog.js';
import { InputValidator } from '../../Utils/InputValidator.js';
import { InvalidStyling } from '../../Utils/InvalidStyling.js';
import PubSub from 'pubsub-js'

export const EditProjectDialog = (function () {
    const editProjectDialog = new Dialog("#edit-project-dialog");
    let projectIndex;
    //Show dialog when a button publishes this topic
    PubSub.subscribe("editProjectDialogOpened", (msg, [name, projectIndexValue]) => {
        projectIndex = projectIndexValue;

        editProjectDialog.showDialog();
        setInputValues(name);
    })

    const editProjectNameInput = document.querySelector("#edit-project-name-input"); 

    function setInputValues(projectName) {
        editProjectNameInput.value = projectName;
    }

    function addProject() {
        const name = editProjectNameInput.value;
        
        if (InputValidator.validateName(name) === false) {
            InvalidStyling.showValidationError(editProjectNameInput, "name");
            return;
        }
        //Publish topic for ToDoStorage to add a new project using the input value
        PubSub.publish("projectEdited", [name, projectIndex]);
        editProjectDialog.clearInputs();
        editProjectDialog.hideDialog();
    }

    function init() {
        confirmButtonInitialization();
        enterKeyInitialization();
    }

    function confirmButtonInitialization() {
        const confirmButton = document.querySelector("#edit-project-dialog .confirm"); 
        confirmButton.addEventListener("click", addProject);
    }

    function enterKeyInitialization() {
        editProjectDialog.dialog.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                addProject();
            }
        });
    }

    return {
        init
    }
})();
   
    
    







