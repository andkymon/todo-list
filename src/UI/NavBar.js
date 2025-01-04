import { ToDoStorage } from '../Logic/ToDoStorage.js';
import { Main } from './Main.js';

export const NavBar = (function () {
    function updateProjectDisplay() {
        clearProjectDisplay();
        displayCurrentProjects();
    }

    /*
        <div class="button-wrapper">
            <button class="nav-button"></button>
            <button class=""small-button delete"></button>
        </div>
    */

    function displayCurrentProjects() {
        for (const [projectIndex, project] of ToDoStorage.projects.entries()) {
            const projectButton = createProjectButton(project.name, projectIndex);
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
            if (navButtonWrapper.id === "all") {
                continue;
            }
            navButtonWrapper.remove();
        }
    }

    function createProjectButton(projectName, projectIndex) {
        const projectButton = document.createElement("button");

        projectButton.classList.add("nav-button");
        projectButton.textContent = projectName;
        projectButton.addEventListener("click", () => {
            navButtonClickEventHandler(projectButton, projectIndex);
        });

        return projectButton;
    }

    function createDeleteButton(projectName, projectIndex) {
        const deleteButton = document.createElement("button");

        deleteButton.classList.add("small-button", "delete");
        deleteButton.addEventListener("click", () => {
            deleteProjectClickEventHandler(deleteButton, projectName, projectIndex);
        });

        return deleteButton;
    }

    function navButtonClickEventHandler(navButton, projectIndex) {
        resetNavButtonStyles();
        navButton.classList.add("selected");
        disableSelectedButton();
        if (projectIndex === -1) {
            Main.hideAddTaskButton();
        } else {
            Main.showAddTaskButton();
        }
        Main.updateTaskDisplay(projectIndex);
    }

    function deleteProjectClickEventHandler(deleteButton, projectName, projectIndex) {
        const transitionTime = 300;

        if (confirm(`Delete ${projectName}?`) === true) {
            ToDoStorage.removeProject(projectIndex);
            deleteProjectTransition(deleteButton, transitionTime);
            //Update project entries after delete transition
            setTimeout(() => {
                updateProjects();
            }, transitionTime);
        }
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
    
    function deleteProjectTransition(deleteButton, transitionTime) {
        const buttonWrapper = deleteButton.parentElement; 
        buttonWrapper.classList.add("removed");
        buttonWrapper.style.transition = `${transitionTime}ms`;
    }

    function getSelectedProjectIndex() {
        const navButtons = document.querySelectorAll("nav > .button-wrapper > .nav-button");
        for (const [navButtonIndex, navButton] of navButtons.entries()) {
            if (navButton.classList.contains("selected")) {
                return navButtonIndex - 1; //'All' button has index of -1, project buttons start with 0
            }
        }
    }

    const allButton = document.querySelector("#all > .nav-button");
    allButton.addEventListener("click", () => {
        navButtonClickEventHandler(allButton, -1);
    });
    allButton.click();
    

    return {
        updateProjectDisplay,
        getSelectedProjectIndex,
    };
})();