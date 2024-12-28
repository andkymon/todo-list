export class ProjectFilter {
    static #weekms = 604800000; //week in milliseconds
    static #todayDate = new Date((new Date()).toDateString()); //toDateString to set time to 12 midnight of the current day
    static #nextWeekDate = new Date(this.#todayDate.getTime() + this.#weekms);
	    
    static filterTasksToday(project) {
        const projectCopy = {...project};
	    projectCopy.tasks = project.tasks.filter((task) => task.dueDate.getTime() === this.#todayDate.getTime());
	    return projectCopy;
    }

    static filterTasksThisWeek(project) {
        const projectCopy = {...project};
	    projectCopy.tasks = project.tasks.filter((task) => (task.dueDate >= this.#todayDate && task.dueDate < this.#nextWeekDate));
	    return projectCopy;
    }
	
    static filterImportantTasks(project) {
        const projectCopy = {...project};
	    projectCopy.tasks = project.tasks.filter((task) => task.isPriority === true);
	    return projectCopy;
    }

    static filterIncompleteTasks(project) {
        const projectCopy = {...project};
	    projectCopy.tasks = project.tasks.filter(task => task.isComplete === false);
	    return projectCopy;
    }

    static filterOverdueTasks(project) {
        const projectCopy = {...project};
        const dateToday = new Date(new Date().toDateString());
	    projectCopy.tasks = project.tasks.filter(task => task.dueDate < dateToday === true);
        return projectCopy;
    }
}