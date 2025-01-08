import PubSub from 'pubsub-js'
import { Main } from './Main.js';
import { NavBar } from '../Nav/NavBar.js';
import { format } from "date-fns";

export class TaskCard {
    #taskName;
    #taskDescription;
    #taskDueDate;
    #taskDueDateFormatted
    #isPriority;
    #isComplete;
    #projectIndex;
    
    #taskCheckbox;
    #infoButton;
    #starButton;
    #editButton;
    #deleteButton;
    
    constructor(taskName, taskDescription, taskDueDate, isPriority, isComplete, projectIndex) {
        this.#taskName = taskName;
        this.#taskDescription = taskDescription;
        this.#taskDueDate = taskDueDate;
        this.#taskDueDateFormatted = format(taskDueDate, "iiii, PP");
        this.#isPriority = isPriority;
        this.#isComplete = isComplete;
        this.#projectIndex = projectIndex;
    }

    /*
        <div class="task">
            <button class="task-checkbox"></button>
            <span class="task-name">Task A</span>
            <span class="due-date">12-01-2000</span>
            <button class="small-button task-info"></button>
            <button class="small-button star"></button>
            <button class="small-button edit"></button>
            <button class="small-button delete"></button>
        </div>
    */

    //Accessed by event listeners
    #taskCard = document.createElement("div");

    displayTask() {
        const main = document.querySelector("main");
        const taskElements = this.#createTaskElements();
        
        for (const taskElement of taskElements) {
            this.#taskCard.append(taskElement);
        }
        //projectIndex necessary to determine which project a task belongs to in 'All Tasks' tab
        //"project" necessary as class names cannot start with number
        this.#taskCard.classList.add("task", "project" + this.#projectIndex);
        main.append(this.#taskCard);
    }

    #createTaskElements() {
        const taskElements = []; 

        taskElements.push(...this.#createTaskButtons()); // Add the buttons (spread operator avoids nested arrays)
        taskElements.splice(1, 0, ...this.#createTaskSpans()); // Insert spans at index 1
    
        return taskElements; // Return the modified array
    }

    #createTaskButtons() {
        const buttonList = [];
        const buttonClassList = ["task-checkbox", "task-info", "star", "edit", "delete", "small-button"];
        
        for (let i = 0; i < 5; i++) {
            const button = document.createElement("button");
            if (i === 0 || i === 2) { //First and third button is used as a checkbox, default checkboxes are hard to style
                this.#appendCheckbox(button);
            } 
            if (i !== 0) { // Add "small-button" class to all buttons except the first
                button.classList.add(buttonClassList[buttonClassList.length - 1]);
            }
            button.classList.add(buttonClassList[i]);
            buttonList.push(button);
        }
        //Assign buttons to these variables as it will be accessed by the methods below
        this.#taskCheckbox = buttonList[0];
        this.#infoButton = buttonList[1];
        this.#starButton = buttonList[2];
        this.#editButton = buttonList[3];
        this.#deleteButton = buttonList[4];

        this.#setCheckboxStatuses();
        this.#addTaskButtonClickEventHandlers();
        return buttonList;
    }

    #createTaskSpans() {
        const spanList = [];
        const spanClassList = ["task-name", "due-date"];
        const spanTextContent = [this.#taskName, this.#taskDueDateFormatted];

        for (let i = 0; i < 2; i++) {
            const span = document.createElement("span");
            span.classList.add(spanClassList[i]);
            span.textContent = spanTextContent[i];
            spanList.push(span);
        }
        spanList[1].style.color = this.#dueDateStyling(); //Due date will be red if overdue

        return spanList;
    }

    #dueDateStyling() {
        const dateToday = new Date((new Date()).toDateString()); // toDateString to set time to 12 midnight of the current day
        if (this.#taskDueDate < dateToday) {
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

    #setCheckboxStatuses() {
        this.#setTaskCompletionStatus();
        this.#setTaskPriorityStatus();
    }

    #setTaskCompletionStatus() {
        if (this.#isComplete === true) {
            this.#taskCheckbox.firstChild.checked = true;
            this.#taskCheckbox.classList.add("checked");
        }
    }

    #setTaskPriorityStatus() {
        if (this.#isPriority === true) {
            this.#starButton.firstChild.checked = true;
            this.#starButton.classList.add("checked");
        }
    }

    //Add task button click event handlers
    #addTaskButtonClickEventHandlers() {
        this.#taskCheckbox.addEventListener("click", () => {
            this.#taskCheckboxEventHandler();
        });

        this.#infoButton.addEventListener("click", () => {
            this.#infoButtonEventHandler();
        });

        this.#starButton.addEventListener("click", () => {
            this.#starButtonEventHandler();
        });

        this.#editButton.addEventListener("click", () => {
            this.#editButtonEventHandler();
        });

        this.#deleteButton.addEventListener("click", () => {
            this.#deleteTaskButtonEventHandler();
        });
    }
    
    #taskCheckboxEventHandler = () => {
        //Default checkbox inside task checkbox button
        const taskCheckboxInnerCheckbox = this.#taskCheckbox.firstChild;
        this.#taskCard.classList.add("clicked");
        const taskIndex = this.#getClickedTaskCardIndex();

        if (taskCheckboxInnerCheckbox.checked === false) {
            this.#taskCheckbox.classList.remove("checked");
            this.#isComplete = false;
            PubSub.publish("taskCompleted", [false, this.#projectIndex, taskIndex]);
        } else {
            this.#taskCheckbox.classList.add("checked");
            this.#isComplete = true;
            PubSub.publish("taskCompleted", [true, this.#projectIndex, taskIndex]);
        }
    }
    
    #infoButtonEventHandler = () => {
        //Publish this topic to open the edit task dialog 
        PubSub.publish("taskInfoDialogOpened", [this.#taskName, this.#taskDescription, this.#taskDueDateFormatted, this.#isPriority, this.#isComplete]);
    }
    

    #editButtonEventHandler = () => {
        this.#taskCard.classList.add("clicked");
        const taskIndex = this.#getClickedTaskCardIndex();
        //Publish this topic to open the edit task dialog, date formatted to "YYYY-MM-DD" for input[type="date"] to recognize 
        PubSub.publish("editTaskDialogOpened", [this.#taskName, this.#taskDescription, format(this.#taskDueDate, "yyyy-MM-dd"), this.#projectIndex, taskIndex]);
    }

    
    #starButtonEventHandler = () => {
        //Default checkbox inside task checkbox button
        const starButtonInnerCheckbox = this.#starButton.firstChild;
        this.#taskCard.classList.add("clicked");
        const taskIndex = this.#getClickedTaskCardIndex();

        if (starButtonInnerCheckbox.checked === false) {
            this.#starButton.classList.remove("checked");
            this.#isPriority = false;
            PubSub.publish("taskStarred", [false, this.#projectIndex, taskIndex]);
        } else {
            this.#starButton.classList.add("checked");
            this.#isPriority = true;
            PubSub.publish("taskStarred", [true, this.#projectIndex, taskIndex]);
        }
    }

    #deleteTaskButtonEventHandler = () => {
        if (confirm(`Delete ${this.#taskName}?`) === true) {
            const transitionTime = 300; //transition time in ms
            //Inform subscribers that a task has been deleted and pass the project index and task index of the deleted task
            this.#taskCard.classList.add("clicked");
            const taskIndex = this.#getClickedTaskCardIndex();
            PubSub.publish("taskDeleted", [this.#projectIndex, taskIndex]);
            this.#playDeleteTaskAnimation();
            //Wait for transition to finish before removing the deleted task from the display
            setTimeout(() => {
                this.#taskCard.remove();
            }, transitionTime);
        }
    }

    #getClickedTaskCardIndex() {
        const taskCards = document.querySelectorAll("main > .task" + ".project" + this.#projectIndex);
        for (const [taskCardIndex, taskCard] of taskCards.entries()) {
            if (taskCard.classList.contains("clicked")) {
                taskCard.classList.remove("clicked");
                return taskCardIndex; 
            }
        }
    }

    #playDeleteTaskAnimation() {
        this.#taskCard.classList.add("removed");
        this.#taskCard.style.transition = `300ms`;
    }
}
