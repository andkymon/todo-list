import { Dialog } from './Dialog.js';
import { ToDoStorage } from '../Logic/ToDoStorage.js';
import { InputValidator } from '../Logic/InputValidator.js';
import { InvalidStyling } from './InvalidStyling.js';
import { Main } from './Main.js';
import { NavBar } from './NavBar.js';

export const TaskDialog = (function () {
    const dialog = new Dialog("#task-dialog", "#add-task", addTask);

    function addTask() {
        const projectIndex = NavBar.getSelectedNavButtonIndex();
        const taskNameInput = document.querySelector("#task-name-input"); 
        const taskDescriptionInput = document.querySelector("#task-description-input"); 
        const taskDateInput = document.querySelector("#task-date-input"); 

        const name = taskNameInput.value;
        const description = taskDescriptionInput.value;
        const dueDate = new Date(taskDateInput.valueAsNumber); //Convert to ms to instantiate a Date object 

        const result = ToDoStorage.addTask(name, description, dueDate, projectIndex);
        if (result === false) {
            if (InputValidator.validateName(name) === false) {
                InvalidStyling.showValidationError(taskNameInput, "name");
            }
            if (InputValidator.validateDescription(description) === false) {
                InvalidStyling.showValidationError(taskDescriptionInput, "description");
            }
            if (InputValidator.validateDate(dueDate) === false) {
                InvalidStyling.showValidationError(taskDateInput, "date");
            }
            return;
        }
        //This is invoked here because it should only execute when this function doesn't return early
        dialog.clearInputs();
        dialog.hideDialog();
        Main.updateTaskDisplay(projectIndex); 
    }
})();
