import { Task } from './Task.js';
import { Project } from './Project.js';
import { InputValidator } from './InputValidator.js';

export class ToDoStorage {
    static projects = [];

    static addTask(name, description, dueDate, isPriority, isComplete, projectIndex) {
        dueDate = new Date(dueDate);
        if (InputValidator.validateTask(name, description, dueDate, isPriority, isComplete, projectIndex, this.projects.length) === false) {
            return false;
        }
        this.projects[projectIndex].tasks.push(new Task(name, description, dueDate, isPriority, isComplete));
    }

    static addProject(name) {
        if (InputValidator.validateName(name) === false) {
            return false;
        }
        this.projects.push(new Project(name));
    }

    static moveTask(initialProjectIndex, taskIndex, targetProjectIndex) {
        if (InputValidator.validateList(initialProjectIndex, this.projects.length) === false 
        || InputValidator.validateList(taskIndex, this.projects[initialProjectIndex].tasks.length) === false
        || InputValidator.validateList(initialProjectIndex, this.projects.length) === false) {
            return false;
        }
        const task = this.projects[initialProjectIndex].tasks[taskIndex];
        this.projects[targetProjectIndex].tasks.push(task);
        this.removeTask(initialProjectIndex, taskIndex);
    }

    static removeTask(projectIndex, taskIndex) {
        if (InputValidator.validateList(projectIndex, this.projects.length) === false 
        || InputValidator.validateList(taskIndex, this.projects[projectIndex].tasks.length) === false) {
            return false;
        }
        this.projects[projectIndex].tasks.splice(taskIndex, 1);
    }

    static removeProject(projectIndex) {
        if (InputValidator.validateList(projectIndex, this.projects.length) === false) {
            return false;
        }
        this.projects.splice(projectIndex, 1);
    }
}