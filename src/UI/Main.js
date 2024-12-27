import { ToDoStorage } from '../logic/ToDoStorage.js';

export class Main {
    static #addTaskBtn = document.querySelector("main #add-task");

    static updateTasks(projectIndex) {
        this.#clearTask();
        if (projectIndex === -1) { //For "all" NavBtn
            for (const project of ToDoStorage.projects) {
                for (const task of project.tasks) {
                    this.#displayTask(task.name, task.dueDate);
                }
            }       
        } else {
            for (const task of ToDoStorage.projects[projectIndex].tasks) {
                this.#displayTask(task.name, task.dueDate);
            }
        }
        this.#playUpdateTaskAnimation();
    }
    static #clearTask() {
        /*Not a static variable because it has to query for an updated list 
        everytime this method is called*/
        const tasks = document.querySelectorAll(".task"); 
        for (const task of tasks) {
            task.remove();
        }
    }
    static #displayTask(name, dueDate) {
        /*
        <div class="task">
            <button class="checkbox"></button>
            <span class="task-name">Task A</span>
            <span class="due-date">12-01-2000</span>
            <button class="small-btn task-info"></button>
            <button class="small-btn important clicked"></button>
            <button class="small-btn edit"></button>
            <button class="small-btn delete"></button>
        </div>
        */
        const main = document.querySelector("main");
        const taskDiv = document.createElement("div");
        const taskElements = [];
        const btnClassList = ["checkbox", "task-info", "important", "edit", "delete", "small-btn"];
        const spanClassList = ["task-name", "due-date"];
        const spanTextContent = [name, dueDate.toDateString()];
    
        for (let i = 0; i < 5; i++) {
            const btn = document.createElement("button");
            if (i != 0) { //Add "small-btn" class to all buttons except the first
                btn.classList.add(btnClassList[btnClassList.length - 1]);
            }
            btn.classList.add(btnClassList[i]);
            taskElements.push(btn);
        }
        for (let i = 0; i < 2; i++) {
            const span = document.createElement("span");
            span.classList.add(spanClassList[i]);
            span.textContent = spanTextContent[i];
            taskElements.splice(i + 1, 0, span); //Add span to index 1 and 2 of taskElements
        }
        taskElements[2].style.color = this.#dueDateStyling(dueDate); //due date will be red if overdue
        for (const taskElement of taskElements) {
            taskDiv.append(taskElement);
        }
        taskDiv.classList.add("task");
        main.append(taskDiv);
    }
    static #playUpdateTaskAnimation() {
        /*Not a static variable because it has to query for an updated list 
        everytime this method is called*/
        const tasks = document.querySelectorAll(".task"); 
        setTimeout(() => {
            for (const task of tasks) {
                task.classList.add("displayed");
            }
        }, 1);      
    }
    static #dueDateStyling(dueDate) {
        const todayDate = new Date((new Date()).toDateString()); //toDateString to set time to 12 midnight of the current day
        if (dueDate < todayDate) {
            return "red";
        } else {
            return "white";
        }
    }
    static hideAddTaskBtn() {
        this.#addTaskBtn.style.display = "none";
    }
    static showAddTaskBtn() {
        this.#addTaskBtn.style.display = "inline-block";
    }
}
