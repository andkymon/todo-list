import { ToDoStorage } from '../Logic/ToDoStorage.js';

export class TaskCard {
    #taskName;
    #dueDate;
    #taskIndex;
    #projectIndex;

    constructor(taskName, dueDate, taskIndex, projectIndex) {
        this.#taskName = taskName;
        this.#dueDate = dueDate;
        this.#taskIndex = taskIndex;
        this.#projectIndex = projectIndex;
    }

    /*
        <div class="task">
            <button class="task-checkbox">
                <input type="checkbox">
            </button>
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

    #createTaskButtons() {
        const buttonList = []
        const buttonClassList = ["task-checkbox", "task-info", "important", "edit", "delete", "small-button"];
        
        for (let i = 0; i < 5; i++) {
            const button = document.createElement("button");
            if (i === 0) { //First button is used as a checkbox, default checkboxes are hard to style
                this.#createTaskCheckbox(button);
            } 
            if (i !== 0) { // Add "small-button" class to all buttons except the first
                button.classList.add(buttonClassList[buttonClassList.length - 1]);
            }
            button.classList.add(buttonClassList[i]);
            buttonList.push(button);
        }

        return buttonList;
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

    //Button specific functions
    //Task Checkbox
    #createTaskCheckbox(button) { //For custom checkbox styling, checkbox input wrapped/hidden by a button
        const taskCheckbox = document.createElement("input");
        taskCheckbox.setAttribute("type", "checkbox");
        button.append(taskCheckbox);
        button.classList.add("checkbox");
        button.addEventListener("click", () => {
            this.#toggleInnerCheckbox(button);
            this.#taskCheckboxEventHandler(button);
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

    #taskCheckboxEventHandler(checkboxButton) {
        //Default checkbox inside button acting as the checkbox
        const innerCheckbox = checkboxButton.firstChild;
        const task = ToDoStorage.projects[this.#projectIndex].tasks[this.#taskIndex];
        if (innerCheckbox.checked === false) {
            task.isComplete = false;
        } else {
            task.isComplete = true;
        }
    }
}