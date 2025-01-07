import PubSub from 'pubsub-js'
import { Main } from './Main.js';
import { NavBar } from '../Nav/NavBar.js';

export class TaskCard {
    #taskName;
    #dueDate;
    #projectIndex;

    constructor(taskName, dueDate, projectIndex) {
        this.#taskName = taskName;
        this.#dueDate = dueDate;
        this.#projectIndex = projectIndex;
    }

    /*
        <div class="task">
            <button class="task-checkbox"></button>
            <span class="task-name">Task A</span>
            <span class="due-date">12-01-2000</span>
            <button class="small-button task-info"></button>
            <button class="small-button important clicked"></button>
            <button class="small-button edit"></button>
            <button class="small-button delete"></button>
        </div>
    */

    displayTask() {
        const main = document.querySelector("main");
        const taskDiv = document.createElement("div");
        const taskElements = this.#createTaskElements();
        
        for (const taskElement of taskElements) {
            taskDiv.append(taskElement);
        }

        taskDiv.classList.add("task");
        main.append(taskDiv);
    }

    #createTaskElements() {
        const taskElements = []; 

        taskElements.push(...this.#createTaskButtons()); // Add the buttons (spread operator avoids nested arrays)
        taskElements.splice(1, 0, ...this.#createTaskSpans()); // Insert spans at index 1
    
        return taskElements; // Return the modified array
    }

    #buttonList = [];

    #createTaskButtons() {
        const buttonClassList = ["task-checkbox", "task-info", "important", "edit", "delete", "small-button"];
        
        for (let i = 0; i < 5; i++) {
            const button = document.createElement("button");
            if (i === 0 || i === 2) { //First and third button is used as a checkbox, default checkboxes are hard to style
                this.#appendCheckbox(button);
            } 
            if (i !== 0) { // Add "small-button" class to all buttons except the first
                button.classList.add(buttonClassList[buttonClassList.length - 1]);
            }
            button.classList.add(buttonClassList[i]);
            this.#buttonList.push(button);
        }
        this.addTaskButtonClickEventHandlers();
        return this.#buttonList;
    }

    #createTaskSpans() {
        const spanList = [];
        const spanClassList = ["task-name", "due-date"];
        const spanTextContent = [this.#taskName, this.#dueDate.toDateString()];

        for (let i = 0; i < 2; i++) {
            const span = document.createElement("span");
            span.classList.add(spanClassList[i]);
            span.textContent = spanTextContent[i];
            spanList.push(span);
        }
        spanList[1].style.color = this.#dueDateStyling(this.#dueDate); //Due date will be red if overdue

        return spanList;
    }

    #dueDateStyling(dueDate) {
        const dateToday = new Date((new Date()).toDateString()); // toDateString to set time to 12 midnight of the current day
        if (dueDate < dateToday) {
            return "red";
        } else {
            return "white";
        }
    }

    //Generic Checkbox
    //For custom checkbox styling, checkbox input wrapped/hidden by a button
    #appendCheckbox(checkboxButton) { 
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkboxButton.classList.add("checkbox");
        checkboxButton.append(checkbox);
        checkboxButton.addEventListener("click", () => {
            this.#toggleInnerCheckbox(checkboxButton);
        });
    }

    #toggleInnerCheckbox(checkboxButton) {
        //Inner checkbox wrapped/hidden by a checkbox button
        const innerCheckbox = checkboxButton.firstChild;
        if (innerCheckbox.checked === false) {
            innerCheckbox.checked = true;
        } else {
            innerCheckbox.checked = false;
        }
    }

    //Add task button click event handlers
    addTaskButtonClickEventHandlers() {
        const deleteButton = this.#buttonList[4];
        deleteButton.addEventListener("click", () => {
            this.#deleteTaskButtonClickEventHandler(deleteButton);
        });
    }

    /*
    #taskCheckboxEventHandler = () => {
        //Default checkbox inside task checkbox button
        const taskCheckboxInnerCheckbox = this.#buttonList[0].firstChild;
        if (taskCheckboxInnerCheckbox.checked === false) {
            PubSub.publish("taskCompletion", false, this.#projectIndex, taskIndex);
        } else {
            PubSub.publish("taskCompletion", true);
        }
    }

    #infoButtonEventHandler = () => {
        InfoDialog.showModal();
    }

    #editButtonEventHandler = () => {
        EditDialog.showModal();
    }

    #starButtonEventHandler = () => {
        //Default checkbox inside task checkbox button
        const taskCheckboxInnerCheckbox = this.#buttonList[2].firstChild;
        if (taskCheckboxInnerCheckbox.checked === false) {
            task.isPriority = false;
        } else {
            task.isPriority = true;
        }
    }
    */

    #deleteTaskButtonClickEventHandler = (deleteButton) => {
        if (confirm(`Delete ${this.#taskName}?`) === true) {
            const taskCard = deleteButton.parentElement;
            taskCard.classList.add("removed");
            //Inform subscribers that a project has been deleted and pass the index of the deleted project
            PubSub.publish("taskDeleted", [this.#projectIndex, this.#getDeletedTaskCardIndex()]);
            taskCard.remove();
        }
    }

    #getDeletedTaskCardIndex() {
        const taskCards = document.querySelectorAll("main > .task");
        for (const [taskCardIndex, taskCard] of taskCards.entries()) {
            if (taskCard.classList.contains("removed")) {
                return taskCardIndex; 
            }
        }
    }
}
