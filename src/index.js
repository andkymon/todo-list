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

ToDoStorage.addTask("Code", "Code for 8 hours", "12-21-2024", "Miscellaneous", true, true);
ToDoStorage.addTask("Eat", "Eat yummy food", "12-20-2024", "Miscellaneous", false, true);
ToDoStorage.addTask("Sleep", "Sleep for 8 hours", "12-30-2024", "Miscellaneous", true, false);

ToDoStorage.addProject("Cry");
ToDoStorage.addProject("Cry".repeat(50));

ToDoStorage.addTask("Sleep".repeat(50), "Sleep for 8 hours", "12-30-2024", "Miscellaneous", true, false);
ToDoStorage.addTask("Sleep", "Sleep for 8 hours".repeat(255), "12-30-2024", "Miscellaneous", true, false);
ToDoStorage.addTask("Sleep", "Sleep for 8 hours", "12-32-2024", "Miscellaneous", true, false);
ToDoStorage.addTask("Sleep", "Sleep for 8 hours", "12-30-2024", "Miscellaneous".repeat(50), true, false);
ToDoStorage.addTask("Sleep", "Sleep for 8 hours", "12-30-2024", "Miscellaneous", "true", false);
ToDoStorage.addTask("Sleep", "Sleep for 8 hours", "12-30-2024", "Miscellaneous", true, "false");

ToDoStorage.projects[0].name = "Misc";
ToDoStorage.projects[0].name = "Misc".repeat(50);

ToDoStorage.projects[0].tasks[0].name = "Test";
ToDoStorage.projects[0].tasks[0].name = "Test".repeat(50);
ToDoStorage.projects[0].tasks[0].description = "Test";
ToDoStorage.projects[0].tasks[0].description = "Test".repeat(255);
ToDoStorage.projects[0].tasks[0].dueDate = new Date("12-19-2024");
ToDoStorage.projects[0].tasks[0].dueDate = "Test";
//projectName to be fixed
ToDoStorage.projects[0].tasks[0].isPriority = false;
ToDoStorage.projects[0].tasks[0].isPriority = "test";
ToDoStorage.projects[0].tasks[0].isComplete = true;
ToDoStorage.projects[0].tasks[0].isPriority = "test";

console.log(ToDoStorage.projects);
console.log(ProjectFilter.filterOff(ToDoStorage.projects[0]));
console.log(ProjectFilter.filterTasksToday(ToDoStorage.projects[0]));
console.log(ProjectFilter.filterTasksThisWeek(ToDoStorage.projects[0]));
console.log(ProjectFilter.filterImportantTasks(ToDoStorage.projects[0]));
console.log(ProjectFilter.filterIncompleteTasks(ToDoStorage.projects[0]));
