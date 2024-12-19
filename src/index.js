import css from "./style.css"

class Task {
    constructor(name, description, dueDate, projectName, isPriority, isComplete) {
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.projectName = projectName;
        this.isPriority = isPriority;
        this.isComplete = isComplete;
    }
}

class Project {
    constructor(name) {
        this.name = name;
    }

    tasks = [];
}

class ToDoStorage {
    static projects = [];

    static addTask(name, description, dueDate, projectName, isPriority, isComplete) {
        dueDate = new Date(dueDate);
        if (InputValidator.validateTask(name, description, dueDate, projectName, isPriority, isComplete) === false) {
            return;
        }
        const projectNames = this.projects.map((project) => project.name);
        if (!projectNames.includes(projectName)) {
            projectNames.push(projectName);
            this.addProject(projectName);
        }
        this.projects[projectNames.indexOf(projectName)].tasks.push(new Task(name, description, dueDate, projectName, isPriority, isComplete));
    }
    static addProject(name) {
        if (InputValidator.validateName(name) === false) {
            return;
        }
        this.projects.push(new Project(name));
    }
}

class InputValidator {
    static validateName(name) {
        const nameStr = name.toString();
        console.log(nameStr);
        if (nameStr === "" || nameStr.length > 50) {
            console.error("Input must be 1 to 50 characters");
            return false;
        }
    }

    static validateDescription(description) {
        const descriptionStr = description.toString();
        console.log(descriptionStr);
        if (descriptionStr.length > 255) {
            console.error("Input must be 0 to 255 characters");
            return false;
        }
    }

    static validateDate(date) {
        console.log(date);
        if (isNaN(date)) {
            console.error("Input format must be MM-DD-YYYY and valid");
			return false
        }
    }

    static validateBoolean(bool) {
        console.log(bool);
        if (typeof bool !== "boolean") {
            console.error("Input must be of boolean data type");
            return false;
        }
    }

    static validateTask(name, description, dueDate, projectName, isPriority, isComplete) {
        const inputs = [this.validateName(name), 
                        this.validateDescription(description),
                        this.validateDate(dueDate),
                        this.validateName(projectName),
                        this.validateBoolean(isPriority),
                        this.validateBoolean(isComplete)
                        ];
        for (const input of inputs) {
            if (input === false) {
                return false;
            }
        }
    }
}

ToDoStorage.addTask("ky", "hanz", "12-01-2000", "poo", true, true);
console.log(ToDoStorage.projects);