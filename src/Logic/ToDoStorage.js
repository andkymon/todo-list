import { Task } from './Task.js';
import { Project } from './Project.js';
import { InputValidator } from '../Utils/InputValidator.js';
import PubSub from 'pubsub-js'

export const ToDoStorage = (function() {
    const projects = [];

    //Topic subscriptions
    PubSub.subscribe("taskAdded", (msg, taskInfoArray) => {
        addTask(...taskInfoArray);
    });
    PubSub.subscribe("projectAdded", (msg, projectName) => {
        addProject(projectName);
    });
    PubSub.subscribe("projectDeleted", (msg, deletedProjectIndex) => {
        removeProject(deletedProjectIndex);
    });

    function addTask(name, description, dueDate, projectIndex) {
        if (InputValidator.validateTask(name, description, dueDate, projectIndex, projects.length) === false) {
            return false;
        }
        projects[projectIndex].tasks.push(new Task(name, description, dueDate));
        //Publish topic for Main to update displayed tasks
        PubSub.publish("tasksUpdated", null);
    }

    function addProject(name) {
        if (InputValidator.validateName(name) === false) {
            return false;
        }
        projects.push(new Project(name));
        //Publish topic for NavBar to update displayed projects
        PubSub.publish("projectsUpdated", projects);
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
        projects,
        addTask,
        addProject,
        removeTask,
        removeProject
    };
})();
