import { Task } from './Task.js';
import { Project } from './Project.js';
import { InputValidator } from '../Utils/InputValidator.js';
import PubSub from 'pubsub-js'
import { ProjectSort } from '../Utils/ProjectSort.js';

export const ToDoStorage = (function() {
    const projects = [];

    //Topic subscriptions
    PubSub.subscribe("taskAdded", (msg, taskInfoArray) => {
        addTask(...taskInfoArray);
    });
    PubSub.subscribe("taskCompleted", (msg, [isComplete, projectIndex, taskindex]) => {
        projects[projectIndex].tasks[taskindex].isComplete = isComplete;
    });
    PubSub.subscribe("taskStarred", (msg, [isPriority, projectIndex, taskindex]) => {
        projects[projectIndex].tasks[taskindex].isPriority = isPriority;
    });
    PubSub.subscribe("taskDeleted", (msg, [projectIndex, taskIndex]) => {
        removeTask(projectIndex, taskIndex);
    });
    PubSub.subscribe("projectAdded", (msg, projectName) => {
        addProject(projectName);
    });
    PubSub.subscribe("projectDeleted", (msg, deletedProjectIndex) => {
        removeProject(deletedProjectIndex);
    });
    PubSub.subscribe("getProjects", (msg, data) => {
        PubSub.publish("projects", getProjects());  // Publish the list of todos when requested
    });

    function getProjects() {
        const projectsCopy = [...projects];
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
        getProjects
    };
})();
