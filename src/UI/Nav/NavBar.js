import PubSub from 'pubsub-js'

export const NavBar = (function () {
    //Display project in NavBar as a nav button when a project is added
    PubSub.subscribe("projectAdded", (msg, projectName) => {
        displayProject(projectName);
    });
    PubSub.subscribe("projectEdited", (msg, [projectName, projectIndex]) => {
        renameProject(projectName, projectIndex);
    });

    /*
        <div class="button-wrapper">
            <button class="nav-button"></button>
            <button class=""small-button delete"></button>
        </div>
    */

    function displayProject(projectName) {
        const projectButton = createProjectButton(projectName);
        const editButton = createEditButton();
        const deleteButton = createDeleteButton();
        const buttonWrapper = document.createElement("div");
        const nav = document.querySelector("nav");
        
        buttonWrapper.classList.add("button-wrapper");
        buttonWrapper.append(projectButton, editButton, deleteButton);
        nav.append(buttonWrapper);
    }

    function renameProject(projectName, projectIndex) {
        const projectButtons = document.querySelectorAll("nav > .button-wrapper:not(#all-tasks) > .nav-button"); //'All Tasks' nav button cannot be edited
        for (const [projectButtonIndex, projectButton] of projectButtons.entries()) {
            if (projectButtonIndex === projectIndex) {
                projectButton.textContent = projectName;
            }
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

    function createEditButton() {
        const editButton = document.createElement("button");

        editButton.classList.add("small-button", "edit");
        editButton.addEventListener("click", () => {
            editProjectButtonEventHandler(editButton);
        });
        return editButton;
    }

    function createDeleteButton() {
        const deleteButton = document.createElement("button");

        deleteButton.classList.add("small-button", "delete");
        deleteButton.addEventListener("click", () => {
            deleteProjectButtonEventHandler(deleteButton);
        });

        return deleteButton;
    }

    function navButtonClickEventHandler(navButton) {
        resetNavButtonStyles();
        navButton.classList.add("selected");
        disableSelectedButton();
        //Publish topic for Main to update displayed tasks based on currently selected nav button
        PubSub.publish("navButtonClicked", getSelectedNavButtonIndex());
    }

    function editProjectButtonEventHandler(editButton) {
        editButton.classList.add("clicked");
        const projectIndex = getEditedProjectButtonIndex();
        const projectName = getEditedProjectButtonName(projectIndex);
        PubSub.publish("editProjectDialogOpened" , [projectName, projectIndex]);
    }

    function deleteProjectButtonEventHandler(deleteButton) {
        const transitionTime = 300; //transition time in ms
        const buttonWrapper = deleteButton.parentElement;
        const projectName = buttonWrapper.firstChild.textContent;

        if (confirm(`Delete ${projectName}?`) === true) {
            clickAllTasksButtonIfSelectedProjectIsDeleted();
            playDeleteProjectTransition(buttonWrapper, transitionTime);
            //Wait for transition to finish before announcing project deletion and removing its respective button wrapper
            setTimeout(() => {
                const projectIndex = getDeletedProjectButtonIndex();
                //Inform subscribers that a project has been deleted and pass the index of the deleted project
                PubSub.publish("projectDeleted", projectIndex);
                buttonWrapper.remove();
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

    function getEditedProjectButtonName(projectIndex) {
        const projectButtons = document.querySelectorAll("nav > .button-wrapper:not(#all-tasks) > .nav-button"); //'All Tasks' nav button cannot be edited
        for (const [projectButtonIndex, projectButton] of projectButtons.entries()) {
            if (projectButtonIndex === projectIndex) {
                return projectButton.textContent;
            }
        }
    }

    function getEditedProjectButtonIndex() {
        const editButtons = document.querySelectorAll("nav .edit"); //'All Tasks' nav button cannot be deleted
        for (const [editButtonIndex, editButton] of editButtons.entries()) {
            if (editButton.classList.contains("clicked")) {
                //Remove click status once editButtonIndex is to be returned
                editButton.classList.remove("clicked");
                return editButtonIndex;
            }
        }
    }
    //Selects the 'All Tasks' nav button if currently selected project is deleted
    function clickAllTasksButtonIfSelectedProjectIsDeleted() {
        const allTasksButton = document.querySelector("#all-tasks > .nav-button");
        if (getDeletedProjectButtonIndex() === getSelectedNavButtonIndex()) {
            allTasksButton.click();
        }
    }
    
    function playDeleteProjectTransition(buttonWrapper, transitionTime) {
        buttonWrapper.classList.add("removed");
        buttonWrapper.style.transition = `${transitionTime}ms`;
    }

    function getDeletedProjectButtonIndex() {
        const projectButtonWrappers = document.querySelectorAll("nav > .button-wrapper:not(#all-tasks)"); //'All Tasks' nav button cannot be deleted
        for (const [projectButtonWrapperIndex, projectButtonWrapper] of projectButtonWrappers.entries()) {
            if (projectButtonWrapper.classList.contains("removed")) {
                return projectButtonWrapperIndex;
            }
        }
    }

    function getSelectedNavButtonIndex() {
        const navButtons = document.querySelectorAll("nav > .button-wrapper > .nav-button");
        for (const [navButtonIndex, navButton] of navButtons.entries()) {
            if (navButton.classList.contains("selected")) {
                return navButtonIndex - 1; //'All Tasks' button has index of -1, project buttons start with 0 to be identical with the ToDoStorage.projects array
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
            //Publish this topic to open the add project dialog 
            PubSub.publish("projectDialogOpened", null);
        });
    }
    
    return {
        getSelectedNavButtonIndex,
        init
    };
})();