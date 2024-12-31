import { Dialog } from './Dialog.js';
import { ToDoStorage } from '../Logic/ToDoStorage.js';
import { InvalidStyling } from './InvalidStyling.js';
import { NavBar } from './NavBar.js';

export const ProjectDialog = (function () {
    const dialog = new Dialog("#project-dialog", "#add-project", addProject);

    function addProject() {
        const projectNameInput = document.querySelector("#project-name-input"); 
        const name = projectNameInput.value;
        const result = ToDoStorage.addProject(name);

        if (result === false) {
            InvalidStyling.showValidationError(projectNameInput, "name");
            return;
        }
        projectNameInput.value = "";
        dialog.hideDialog();
        NavBar.updateProjectDisplay(); 
    }

    return dialog;
})();
   
    
    







