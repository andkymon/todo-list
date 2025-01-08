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
    PubSub.subscribe("taskCompleted", (msg, [isComplete, projectIndex, taskIndex]) => {
        const task = projects[projectIndex].tasks[taskIndex];
        task.isComplete = isComplete;
    });
    PubSub.subscribe("taskStarred", (msg, [isPriority, projectIndex, taskIndex]) => {
        const task = projects[projectIndex].tasks[taskIndex];
        task.isPriority = isPriority;
    });
    PubSub.subscribe("taskEdited", (msg, [name, description, dueDate, projectIndex, taskIndex]) => {
        const task = projects[projectIndex].tasks[taskIndex];
        task.name = name;
        task.description = description;
        task.dueDate = dueDate;
        //Sort projects by date after task edit, in case date has been changed
        ProjectSort.sortByDate(projects[projectIndex]);
    });
    PubSub.subscribe("taskDeleted", (msg, [projectIndex, taskIndex]) => {
        removeTask(projectIndex, taskIndex);
    });
    PubSub.subscribe("projectAdded", (msg, projectName) => {
        addProject(projectName);
    });
    PubSub.subscribe("projectEdited", (msg, [projectName, projectIndex]) => {
        const project = projects[projectIndex];
        project.name = projectName;
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
