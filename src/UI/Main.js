import { ToDoStorage } from '../Logic/ToDoStorage.js';

export const Main = (function () {
    function updateTaskDisplay(projectIndex) {
        clearTaskDisplay();
        displaySelectedProjectTasks(projectIndex);
        playUpdateTaskTransition();
    }

    function clearTaskDisplay() {
        const tasks = document.querySelectorAll(".task"); 
        for (const task of tasks) {
            task.remove();
        }
    }

    function displaySelectedProjectTasks(projectIndex) {
        if (projectIndex === -1) { // For "all" Nav Button
            for (const project of ToDoStorage.projects) {
                for (const task of project.tasks) {
                    displayTask(task.name, task.dueDate);
                }
            }       
        } else {
            for (const task of ToDoStorage.projects[projectIndex].tasks) {
                displayTask(task.name, task.dueDate);
            }
        }
    }

    /*
        <div class="task">
            <button class="checkbox"></button>
            <span class="task-name">Task A</span>
            <span class="due-date">12-01-2000</span>
            <button class="small-button task-info"></button>
            <button class="small-button important clicked"></button>
            <button class="small-button edit"></button>
            <button class="small-button delete"></button>
        </div>
    */

    function displayTask(taskName, dueDate) {
        const main = document.querySelector("main");
        const taskDiv = document.createElement("div");
        const taskElements = createTaskElements(taskName, dueDate);
        
        for (const taskElement of taskElements) {
            taskDiv.append(taskElement);
        }

        taskDiv.classList.add("task");
        main.append(taskDiv);
    }

    function createTaskElements(taskName, dueDate) {
        const taskElements = []; 

        taskElements.push(...createTaskButtons()); // Add the buttons (spread operator avoids nested arrays)
        taskElements.splice(1, 0, ...createTaskSpans(taskName, dueDate)); // Insert spans at index 1
    
        return taskElements; // Return the modified array
    }

    function createTaskButtons() {
        const buttonList = []
        const buttonClassList = ["task-checkbox", "task-info", "important", "edit", "delete", "small-button"];
        
        for (let i = 0; i < 5; i++) {
            const button = document.createElement("button");
            if (i === 0 || i === 2) { //First and third button are used as a checkbox, default checkboxes are hard to style
                createCustomCheckbox(button);
            } 
            if (i !== 0) { // Add "small-button" class to all buttons except the first
                button.classList.add(buttonClassList[buttonClassList.length - 1]);
            }
            button.classList.add(buttonClassList[i]);
            buttonList.push(button);
        }

        return buttonList;
    }

    function createTaskSpans(taskName, dueDate) {
        const spanList = [];
        const spanClassList = ["task-name", "due-date"];
        const spanTextContent = [taskName, dueDate.toDateString()];

        for (let i = 0; i < 2; i++) {
            const span = document.createElement("span");
            span.classList.add(spanClassList[i]);
            span.textContent = spanTextContent[i];
            spanList.push(span);
        }
        spanList[1].style.color = dueDateStyling(dueDate); //Due date will be red if overdue

        return spanList;
    }

    function playUpdateTaskTransition() {
        const tasks = document.querySelectorAll(".task"); 
        //Wait for content to load without "displayed" class, then add it after 1ms for transition to trigger
        setTimeout(() => {
            for (const task of tasks) {
                task.classList.add("displayed");
            }
        }, 1);      
    }

    function dueDateStyling(dueDate) {
        const dateToday = new Date((new Date()).toDateString()); // toDateString to set time to 12 midnight of the current day
        if (dueDate < dateToday) {
            return "red";
        } else {
            return "white";
        }
    }

    function createCustomCheckbox(button) { //For custom checkbox styling, appends an invisible checkbox inside a button passed as argument
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        button.append(checkbox);
        button.classList.add("checkbox");
    } 

    const addTaskButton = document.querySelector("main #add-task");

    function hideAddTaskButton() {
        addTaskButton.style.display = "none";
    }

    function showAddTaskButton() {
        addTaskButton.style.display = "inline-block";
    }

    return {
        updateTaskDisplay,
        hideAddTaskButton,
        showAddTaskButton
    };
})();
