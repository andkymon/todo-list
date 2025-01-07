import { TaskCard } from './TaskCard.js';
import PubSub from 'pubsub-js'

export const Main = (function () {
    //Update task display when a nav button is clicked
    let navButtonIndex;
    PubSub.subscribe("navButtonClicked", (msg, index) => {
        navButtonIndex = index;
        updateTaskDisplay();
    });
    //Display a new task card when a task is added to selected project
    PubSub.subscribe("taskAdded", (msg, data) => {
        updateTaskDisplay();
    });

    function updateTaskDisplay() {
        clearTaskDisplay();
        displaySelectedProjectTasks();
    }

    function clearTaskDisplay() {
        const tasks = document.querySelectorAll("main > :not(.h2-wrapper)"); 
        for (const task of tasks) {
            task.remove();
        }
    }

    function displaySelectedProjectTasks() {
        //Publish the event requesting the projects array
        PubSub.publish('getProjects', null);

        let allProjects;
        //Subscribe to the event that provides the projectsArray
        const token = PubSub.subscribe('projects', (msg, projectsArray) => {
            allProjects = projectsArray;
            //Logic is inside this function because when outside, it does not wait for the projectsArray to be received
            if (navButtonIndex === -1) { //For "All Tasks" Nav Button
                for (const [projectIndex, project] of allProjects.entries()) {
                    generateProjectHeading(project.name);
                    for (const task of project.tasks) {
                        const taskCard = new TaskCard(task.name, task.dueDate, projectIndex); //TODO
                        taskCard.displayTask();
                    }
                }     
                //Disable task addition for "All Tasks" Nav Button
                hideAddTaskButton();  
            } else { //For Project Nav Buttons
                const projectIndex = navButtonIndex;
                for (const task of allProjects[projectIndex].tasks) {
                    const taskCard = new TaskCard(task.name, task.dueDate, projectIndex); //TODO
                    taskCard.displayTask();
                }
                //Enable task addition for project buttons
                showAddTaskButton();
            }
            // Unsubscribe to prevent multiple subscriptions
            PubSub.unsubscribe(token);
        });
    }

    function generateProjectHeading(projectName) {
        const main = document.querySelector("main");
        const projectHeading = document.createElement("h3");
        projectHeading.textContent = projectName;

        main.append(projectHeading);
    }

    //Indicate 'No Tasks' when a project has no tasks
    /*
    function generateNoTasksSpans() {
        const projectHeadings = document.querySelectorAll("main h3");
        const mainh2Wrapper = document.querySelector("main .h2-wrapper");
        const span = document.createElement("span");
        span.textContent = "No Tasks.";

        for (const projectHeading of projectHeadings) {
            if (!projectHeading.nextSibling || projectHeading.nextSibling.tagName === "H3") {
                projectHeading.after(span);
            } 
        }
        if (!mainh2Wrapper.nextSibling) {
            mainh2Wrapper.after(span);
        }
    }
    */

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
            //Publish this topic to open the add task dialog 
            PubSub.publish("taskDialogOpened", null);
        });
    }

    return {
        init
    };
})();
