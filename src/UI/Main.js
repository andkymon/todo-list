import { ToDoStorage } from '../Logic/ToDoStorage.js';
import { TaskCard } from './TaskCard.js';
import PubSub from 'pubsub-js'

export const Main = (function () {
    let navButtonIndex;
    //Update task display when a nav button is clicked
    PubSub.subscribe("navButtonClicked", (msg, index) => {
        navButtonIndex = index;
        updateTaskDisplay(navButtonIndex);
    });
    //Update task display when a task is added to selected nav button
    PubSub.subscribe("tasksUpdated", (msg, data) => {
        updateTaskDisplay(navButtonIndex);
    });

    function updateTaskDisplay(navButtonIndex) {
        clearTaskDisplay();
        displaySelectedProjectTasks(navButtonIndex);
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
            for (const [projectIndex, project] of ToDoStorage.projects.entries()) {
                for (const [taskIndex, task] of project.tasks.entries()) {
                    const taskCard = new TaskCard(task.name, task.dueDate, taskIndex, projectIndex);
                    taskCard.displayTask();
                }
            }     
            hideAddTaskButton();  
        } else {
            for (const [taskIndex, task] of ToDoStorage.projects[projectIndex].tasks.entries()) {
                const taskCard = new TaskCard(task.name, task.dueDate, taskIndex, projectIndex);
                taskCard.displayTask();
            }
            showAddTaskButton();
        }
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

    const addTaskButton = document.querySelector("main #add-task");

    function hideAddTaskButton() {
        addTaskButton.style.display = "none";
    }

    function showAddTaskButton() {
        addTaskButton.style.display = "inline-block";
    }

    function init() {  
        //#add-task button initialization
        const addTaskButton = document.querySelector("#add-task");
        addTaskButton.addEventListener("click", () => {
            //
            PubSub.publish("taskDialogOpened", null);
        });
    }

    return {
        init
    };
})();
