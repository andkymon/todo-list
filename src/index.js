import css from "./style.css"

class Task {
    #name;
    #description;
    #dueDate;
    #projectName;
    #isPriority;
    #isComplete;

    constructor(name, description, dueDate, projectName, isPriority, isComplete) {
        this.#name = name;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#projectName = projectName;
        this.#isPriority = isPriority;
        this.#isComplete = isComplete;
    }

    get name() {
        return this.#name;
    }
    set name(str) {
        if (InputValidator.validateName(str) === false) {
            return;
        }
        this.#name = str;
    }

    get description() {
        return this.#description;
    }
    set description(str) {
        if (InputValidator.validateDescription(str) === false) {
            return;
        }
        this.#description = str;
    }

    get dueDate() {
        return this.#dueDate;
    }
    set dueDate(date) {
        if (InputValidator.validateDate(date) === false) {
            return;
        }
        this.#dueDate = date;
    }

    get projectName() {
        return this.#projectName;
    }
    set projectName(str) {
        if (InputValidator.validateName(str) === false) {
            return;
        }
        this.#projectName = str;
    }

    get isPriority() {
        return this.#isPriority;
    }
    set isPriority(bool) {
        if (InputValidator.validateBoolean(bool) === false) {
            return;
        }
        this.#isPriority = bool;
    }

    get isComplete() {
        return this.#isComplete;
    }
    set isComplete(bool) {
        if (InputValidator.validateBoolean(bool) === false) {
            return;
        }
        this.#isComplete = bool;
    }
}

class Project {
    #name;
    constructor(name) {
        this.#name = name;
    }

    tasks = [];

    get name() {
        return this.#name;
    }
    set name(name) {
        if (InputValidator.validateName(name) === false) {
            return;
        }
        this.#name = name;
    }
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

ToDoStorage.addTask("ky", "hanz", "12-01-2000", "pooproject", true, true);
ToDoStorage.projects[0].name = "1234567890123456";
ToDoStorage.projects[0].name = "1234123456789012345612345678901234561234567890123456567890123456123456789012345612345678901234561234567890123456";
ToDoStorage.projects[0].tasks[0].name = "1234123456789012345612345678901234561234567890123456567890123456123456789012345612345678901234561234567890123456";
ToDoStorage.projects[0].tasks[0].name = "kyle";

console.log(ToDoStorage.projects);
