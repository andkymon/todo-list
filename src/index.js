import css from "./style.css"

class Task {
    #name;
    #description;
    #dueDate;
    #isPriority;
    #isComplete;

    constructor(name, description, dueDate, isPriority, isComplete) {
        this.#name = name;
        this.#description = description;
        this.#dueDate = dueDate;
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

    static addTask(name, description, dueDate, isPriority, isComplete, projectIndex) {
        dueDate = new Date(dueDate);
        if (InputValidator.validateTask(name, description, dueDate, isPriority, isComplete, projectIndex, this.projects.length) === false) {
            return;
        }
        this.projects[projectIndex].tasks.push(new Task(name, description, dueDate, isPriority, isComplete));
    }

    static addProject(name) {
        if (InputValidator.validateName(name) === false) {
            return;
        }
        this.projects.push(new Project(name));
    }

    static removeTask(projectIndex, taskIndex) {
        this.projects[projectIndex].tasks.splice(taskIndex, 1);
    }

    static removeProject(projectIndex) {
        this.projects.splice(projectIndex, 1);
    }
}

class InputValidator {
    static validateName(name) {
        const nameStr = name.toString();
        if (nameStr === "" || nameStr.length > 50) {
            console.error("Input must be 1 to 50 characters");
            return false;
        }
    }

    static validateDescription(description) {
        const descriptionStr = description.toString();
        if (descriptionStr.length > 255) {
            console.error("Input must be 0 to 255 characters");
            return false;
        }
    }

    static validateDate(date) {
        if (isNaN(date)) {
            console.error("Input format must be MM-DD-YYYY and valid");
			return false
        }
    }

    static validateBoolean(bool) {
        if (typeof bool !== "boolean") {
            console.error("Input must be of boolean data type");
            return false;
        }
    }

    static validateProject(projectIndex, totalProjects) {
        if (!Number.isInteger(projectIndex) || projectIndex < 0 || projectIndex >= totalProjects) {
            console.error("Invalid project selected");
            return false;
        }
    }

    static validateTask(name, description, dueDate, isPriority, isComplete, projectIndex, totalProjects) {
        const inputs = [this.validateName(name), 
                        this.validateDescription(description),
                        this.validateDate(dueDate),
                        this.validateBoolean(isPriority),
                        this.validateBoolean(isComplete),
                        this.validateProject(projectIndex, totalProjects)
                        ];
        for (const input of inputs) {
            if (input === false) {
                return false;
            }
        }
    }
}

class ProjectFilter {
    static filterOff(project) {
        return project.tasks;
    }

    static #weekms = 604800000; //week in milliseconds
    static #todayDate = new Date((new Date()).toDateString()); //toDateString to set time to 12 midnight of the current day
    static #nextWeekDate = new Date(this.#todayDate.getTime() + this.#weekms);
	    
    static filterTasksToday(project) {
        const allTasks = project.tasks;
	    const todayTasks = allTasks.filter((task) => task.dueDate.getTime() === this.#todayDate.getTime());
	    return todayTasks;
    }

    static filterTasksThisWeek(project) {
        const allTasks = project.tasks;
	    const weekTasks = allTasks.filter((task) => (task.dueDate >= this.#todayDate && task.dueDate < this.#nextWeekDate));
	    return weekTasks;
    }
	
    static filterImportantTasks(project) {
        const allTasks = project.tasks;
	    const importantTasks = allTasks.filter((task) => task.isPriority === true);
	    return importantTasks;
    }

    static filterIncompleteTasks(project) {
        const allTasks = project.tasks
	    const incompleteTasks = allTasks.filter(task => task.isComplete === false);
	    return incompleteTasks;
    }
}

ToDoStorage.addProject("A");
ToDoStorage.addProject("B");
ToDoStorage.addProject("C");

ToDoStorage.addTask("Code", "Code for 8 hours", "12-21-2024", true, true, 0);
ToDoStorage.addTask("Eat", "Eat yummy food", "12-20-2024", false, true, 0);
ToDoStorage.addTask("Sleep", "Sleep for 8 hours", "12-30-2024", true, false, 0);
ToDoStorage.addTask("Sleepy", "Sleep for 8 hours", "12-30-2024", true, false, 1);


ToDoStorage.addTask("Code", "Code for 8 hours", "12-21-2024", true, true, 1);
ToDoStorage.addTask("Sleep", "Sleep for 8 hours", "12-30-2024", true, false, 2);
ToDoStorage.addTask("Sleep", "Sleep for 8 hours", "12-30-2024", true, false, 1);


ToDoStorage.removeProject(2);
console.log(ToDoStorage.projects);


