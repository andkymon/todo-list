import { Task } from './Task.js';
import { Project } from './Project.js';
import { InputValidator } from '../Utils/InputValidator.js';
import PubSub from 'pubsub-js'
import { ProjectSort } from '../Utils/ProjectSort.js';

export const ToDoStorage = (function() {
    let projects = [];

    function init() {
        //Retrieving the JSON string of locally saved copy of projects
        const projectsString = localStorage.getItem("projects");
        //If JSON retrieval is unsuccessful, end the function and keep projects as an empty array. Else, parse it.
        if (!projectsString) {
            return;
        } else {
            const projectsCopy = JSON.parse(projectsString);
            //Retrieved projectsCopy has regular objects with public variables
            //Convert its contents to proper class instances using the task and project constructors
            initializeProjects(projectsCopy);
        }
        //Dispatch an event once projects array has been initialized, sending a copy of the array (Used by NavBar.js)
        const projectsInitialized = new CustomEvent("projectsInitialized", { detail: getProjects() });
        document.dispatchEvent(projectsInitialized); 
    }

    //Topic subscriptions
    PubSub.subscribe("taskAdded", (msg, taskInfoArray) => {
        addTask(...taskInfoArray);
        saveProjectsToLocalStorage();
    });
    PubSub.subscribe("taskCompleted", (msg, [isComplete, projectIndex, taskIndex]) => {
        const task = projects[projectIndex].tasks[taskIndex];
        task.isComplete = isComplete;
        saveProjectsToLocalStorage();
    });
    PubSub.subscribe("taskStarred", (msg, [isPriority, projectIndex, taskIndex]) => {
        const task = projects[projectIndex].tasks[taskIndex];
        task.isPriority = isPriority;
        saveProjectsToLocalStorage();
    });
    PubSub.subscribe("taskEdited", (msg, [name, description, dueDate, projectIndex, taskIndex]) => {
        const task = projects[projectIndex].tasks[taskIndex];
        task.name = name;
        task.description = description;
        task.dueDate = dueDate;
        //Sort projects by date after task edit, in case date has been changed
        ProjectSort.sortByDate(projects[projectIndex]);
        saveProjectsToLocalStorage();
    });
    PubSub.subscribe("taskDeleted", (msg, [projectIndex, taskIndex]) => {
        removeTask(projectIndex, taskIndex);
        saveProjectsToLocalStorage();
    });
    PubSub.subscribe("projectAdded", (msg, projectName) => {
        addProject(projectName);
        saveProjectsToLocalStorage();
    });
    PubSub.subscribe("projectEdited", (msg, [projectName, projectIndex]) => {
        const project = projects[projectIndex];
        project.name = projectName;
        saveProjectsToLocalStorage();
    });
    PubSub.subscribe("projectDeleted", (msg, deletedProjectIndex) => {
        removeProject(deletedProjectIndex);
        saveProjectsToLocalStorage();
    });
    PubSub.subscribe("getProjects", (msg, data) => {
        PubSub.publish("projects", getProjects());  //Publish the list of todos when requested
    });

    function initializeProjects(projectsCopy) {
        for (const [projectCopyIndex, projectCopy] of projectsCopy.entries()) {
            addProject(projectCopy.name);
            for (const [taskCopyIndex, taskCopy] of projectCopy.tasks.entries()) {
                //Use new Date() because dates are still strings after parsing
                addTask(taskCopy.name, taskCopy.description, new Date(taskCopy.dueDate), projectCopyIndex);
                //Set the statuses of newly added task
                projects[projectCopyIndex].tasks[taskCopyIndex].isPriority = taskCopy.isPriority; 
                projects[projectCopyIndex].tasks[taskCopyIndex].isComplete = taskCopy.isComplete;
            }
        }
    }
    //Get a copy of projects array with public variables before converting it to string, as private variables are not included by stringify
    function saveProjectsToLocalStorage() {
        const projectsArrayCopy = getProjects();
        const projectsString = JSON.stringify(projectsArrayCopy);
        localStorage.setItem("projects", projectsString);
    }
    //Get a copy of projects array with public variables
    function getProjects() {
        const projectsCopy = [];
        for (const project of projects) {
            const projectCopy = {};
            projectCopy.name = project.name;
            projectCopy.tasks = [];
            for (const task of project.tasks) {
                const taskCopy = {};
                taskCopy.name = task.name;
                taskCopy.description = task.description;
                taskCopy.dueDate = task.dueDate;
                taskCopy.isPriority = task.isPriority;
                taskCopy.isComplete = task.isComplete;
                projectCopy.tasks.push(taskCopy);
            }
            projectsCopy.push(projectCopy);
        }
        return projectsCopy;
    }

    function addTask(name, description, dueDate, projectIndex) {
        if (InputValidator.validateTask(name, description, dueDate, projectIndex, projects.length) === false) {
            return false;
        }
        projects[projectIndex].tasks.push(new Task(name, description, dueDate));
        ProjectSort.sortByDate(projects[projectIndex]);
    }

    function addProject(name) {
        if (InputValidator.validateName(name) === false) {
            return false;
        }
        projects.push(new Project(name));
    }

    function removeTask(projectIndex, taskIndex) {
        if (InputValidator.validateList(projectIndex, projects.length) === false 
        || InputValidator.validateList(taskIndex, projects[projectIndex].tasks.length) === false) {
            return false;
        }
        projects[projectIndex].tasks.splice(taskIndex, 1);
    }

    function removeProject(projectIndex) {
        if (InputValidator.validateList(projectIndex, projects.length) === false) {
            return false;
        }
        projects.splice(projectIndex, 1);
    }

    return {
        init
    }
})();
