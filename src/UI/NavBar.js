import PubSub from 'pubsub-js'

export const NavBar = (function () {
    //Update displayed projects when a project is added
    //Based on current state of 'projects' array from ToDoStorage.js
    PubSub.subscribe("ToDoStorageUpdated", (msg, projectsArray) => {
        updateProjectDisplay(projectsArray);
    });

    function updateProjectDisplay(projectsArray) {
        clearProjectDisplay();
        displayProjects(projectsArray);
    }

    /*
        <div class="button-wrapper">
            <button class="nav-button"></button>
            <button class=""small-button delete"></button>
        </div>
    */

    function displayProjects(projectsArray) {
        for (const [projectIndex, project] of projectsArray.entries()) {
            const projectButton = createProjectButton(project.name);
            const deleteButton = createDeleteButton(project.name, projectIndex);
            const buttonWrapper = document.createElement("div");
            const nav = document.querySelector("nav");
            
            buttonWrapper.classList.add("button-wrapper");
            buttonWrapper.append(projectButton, deleteButton);
            nav.append(buttonWrapper);
        }
    }

    function clearProjectDisplay() {
        const navButtonWrappers = document.querySelectorAll("nav .button-wrapper");

        for (const navButtonWrapper of navButtonWrappers) {
            if (navButtonWrapper.id === "all-tasks") {
                continue;
            }
            navButtonWrapper.remove();
        }
    }

    function createProjectButton(projectName) {
        const projectButton = document.createElement("button");

        projectButton.classList.add("nav-button");
        projectButton.textContent = projectName;
        projectButton.addEventListener("click", () => {
            navButtonClickEventHandler(projectButton);
        });

        return projectButton;
    }

    function createDeleteButton(projectName, projectIndex) {
        const deleteButton = document.createElement("button");

        deleteButton.classList.add("small-button", "delete");
        deleteButton.addEventListener("click", () => {
            deleteProjectButtonClickEventHandler(deleteButton, projectName, projectIndex);
        });

        return deleteButton;
    }

    function navButtonClickEventHandler(navButton) {
        resetNavButtonStyles();
        navButton.classList.add("selected");
        disableSelectedButton();
        //Publish topic for Main to update displayed tasks
        PubSub.publish('navButtonClicked', getSelectedNavButtonIndex());
    }

    function deleteProjectButtonClickEventHandler(deleteButton, projectName, projectIndex) {
        const transitionTime = 300;

        if (confirm(`Delete ${projectName}?`) === true) {
            clickAllButtonWhenSelectedProjectIsDeleted(projectIndex);
            playDeleteProjectTransition(deleteButton, transitionTime);
            //Delete project after delete transition is done
            setTimeout(() => {
                PubSub.publish("projectDeleted", projectIndex);
            }, transitionTime);
        }
        //Do nothing and return undefined when confirm() is cancelled
    }

    function resetNavButtonStyles() {
        const navButtons = document.querySelectorAll(".nav-button");
        for (const navButton of navButtons) {
            navButton.classList.remove("selected");
        }
    }

    function disableSelectedButton() {
        const navButtons = document.querySelectorAll(".nav-button");
        for (const navButton of navButtons) {
            navButton.disabled = navButton.classList.contains("selected");
        }
    }

    function clickAllButtonWhenSelectedProjectIsDeleted(deletedProjectIndex) {
        const allTasksButton = document.querySelector("#all-tasks > .nav-button");
        if (deletedProjectIndex === getSelectedNavButtonIndex()) {
            allTasksButton.click();
        }
    }
    
    function playDeleteProjectTransition(deleteButton, transitionTime) {
        const buttonWrapper = deleteButton.parentElement; 
        buttonWrapper.classList.add("removed");
        buttonWrapper.style.transition = `${transitionTime}ms`;
    }

    function getSelectedNavButtonIndex() {
        const navButtons = document.querySelectorAll("nav > .button-wrapper > .nav-button");
        for (const [navButtonIndex, navButton] of navButtons.entries()) {
            if (navButton.classList.contains("selected")) {
                return navButtonIndex - 1; //'All Tasks' button has index of -1, project buttons start with 0
            }
        }
    }

    function init() {
        initializeAllTasksButton();
        initializeAddProjectButton(); 
    }   

    function initializeAllTasksButton() {
        //#all-tasks button initialization
        const allTasksButton = document.querySelector("#all-tasks > .nav-button");
        allTasksButton.addEventListener("click", () => {
            navButtonClickEventHandler(allTasksButton);
        });
        allTasksButton.click();
    }

    function initializeAddProjectButton() {
        //#add-project button initialization
        const addProjectButton = document.querySelector("#add-project");
        addProjectButton.addEventListener("click", () => {
            PubSub.publish("projectDialogOpened", null);
        });
    }
    
    return {
        getSelectedNavButtonIndex,
        init
    };
})();