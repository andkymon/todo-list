import { Task } from './Task.js';
import { Project } from './Project.js';
import { InputValidator } from './InputValidator.js';

export const ToDoStorage = (function() {
    const projects = [];

    function addTask(name, description, dueDate, projectIndex) {
        if (InputValidator.validateTask(name, description, dueDate, projectIndex, projects.length) === false) {
            return false;
        }
        projects[projectIndex].tasks.push(new Task(name, description, dueDate));
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
        projects,
        addTask,
        addProject,
        removeTask,
        removeProject
    };
})();
