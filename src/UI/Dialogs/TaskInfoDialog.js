import { Dialog } from './Dialog.js';

export const TaskInfoDialog = (function () {
    const taskInfoDialog = new Dialog("#task-info-dialog");

    document.addEventListener("taskInfoDialogOpened", (event) => {
        const [name, description, dueDate, isPriority, isComplete] = event.detail;
        taskInfoDialog.showDialog();
        setTaskInfoValues(name, description, dueDate, isPriority, isComplete);
    });

    function setTaskInfoValues(taskName, taskDescription, taskDate, isPriority, isComplete) {
        const taskInfoName = document.querySelector("#task-info-dialog h2"); 
        const taskInfoDescription = document.querySelector(".task-info-content.description"); 
        const taskInfoDate = document.querySelector(".task-info-content.date"); 
        const taskInfoPriority = document.querySelector(".task-info-content.priority"); 
        const taskInfoComplete = document.querySelector(".task-info-content.complete"); 
        
        taskInfoName.textContent = taskName;
        taskInfoDescription.textContent = taskDescription;
        taskInfoDate.textContent = taskDate;
        if (isPriority === true) {
            taskInfoPriority.textContent = "High";
        } else {
            taskInfoPriority.textContent = "Low";
        }
        if (isComplete === true) {
            taskInfoComplete.textContent = "Yes";
        } else {
            taskInfoComplete.textContent = "No";
        }    
    }
})();