import { TaskCard } from './TaskCard.js';

export const Main = (function () {
    //Update task display when a nav button is clicked
    let navButtonIndex;
    document.addEventListener("navButtonClicked", (event) => {
        navButtonIndex = event.detail;  // Get the index from event detail
        updateTaskDisplay();
    });

    //Update task display when a task is added
    document.addEventListener("taskAdded", () => {
        updateTaskDisplay();
    });

    //Update task display when a task is edited
    document.addEventListener("taskEdited", () => {
        updateTaskDisplay();
    });

    //Update task display when a project is added and 'All Tasks' tab is selected
    document.addEventListener("projectAdded", () => {
        if (navButtonIndex === -1) {
            updateTaskDisplay();
        }
    });

    //Update task display when a project is edited and 'All Tasks' tab is selected
    document.addEventListener("projectEdited", () => {
        if (navButtonIndex === -1) {
            updateTaskDisplay();
        }
    });

    //Update task display when a project is deleted and 'All Tasks' tab is selected
    document.addEventListener("projectDeleted", () => {
        if (navButtonIndex === -1) {
            updateTaskDisplay();
        }
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
        //Dispatch the event requesting the projects array
        document.dispatchEvent(new CustomEvent('getProjects'));
    }

    //Runs after "projects" event triggers as a response to "getProjects"
    const projectsReceived = (event) => {
        const allProjects = event.detail;  //Retrieve the projectsArray from the event detail

        //Logic is inside this function to ensure it waits for the projects to be received before execution
        if (navButtonIndex === -1) { // For "All Tasks" Nav Button
            for (const [projectIndex, project] of allProjects.entries()) {
                generateProjectHeading(project.name);
                for (const task of project.tasks) {
                    const taskCard = new TaskCard(task.name, task.description, task.dueDate, task.isPriority, task.isComplete, projectIndex);
                    taskCard.displayTask();
                }
            }     
            //Disable task addition for "All Tasks" Nav Button
            hideAddTaskButton();  
        } else { //For Project Nav Buttons
            const projectIndex = navButtonIndex;
            for (const task of allProjects[projectIndex].tasks) {
                const taskCard = new TaskCard(task.name, task.description, task.dueDate, task.isPriority, task.isComplete, projectIndex);
                taskCard.displayTask();
            }
            //Enable task addition for project buttons
            showAddTaskButton();
        }
        //Indicate 'No Tasks' when a project has no tasks
        generateNoTasksSpans();
        //Wait 5ms for page to load before playing transition
        setTimeout(() => {
            playUpdateTaskDisplayTransition();
        }, 5);
    };

    //Listen for the 'projects' event which provides the projectsArray
    document.addEventListener('projects', projectsReceived);
    
    function playUpdateTaskDisplayTransition() {
        const tasks = document.querySelectorAll(".task");
        for (const task of tasks) {
            task.classList.add("displayed");
        }
    }

    function generateProjectHeading(projectName) {
        const main = document.querySelector("main");
        const projectHeading = document.createElement("h3");
        projectHeading.textContent = projectName;

        main.append(projectHeading);
    }

    //Indicate 'No Tasks' when a project has no tasks
    function generateNoTasksSpans() {
        const projectHeadings = document.querySelectorAll("main h3");
        const mainh2Wrapper = document.querySelector("main .h2-wrapper");

        // Loop through project headings
        for (const projectHeading of projectHeadings) {
            const span = document.createElement("span");
            span.textContent = "No Tasks.";
    
            // If the next sibling is missing or another heading
            if (!projectHeading.nextElementSibling || projectHeading.nextSibling.tagName === "H3") {
                projectHeading.after(span);
            }
        }
    
        // Check for mainh2Wrapper after all headings
        if (!mainh2Wrapper.nextElementSibling) {
            const span = document.createElement("span");
            span.textContent = "No Tasks.";
            mainh2Wrapper.after(span);
        }
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
            // Dispatch a custom event to open the add task dialog
            document.dispatchEvent(new CustomEvent("taskDialogOpened"));
        });
    }

    return {
        init
    };
})();
