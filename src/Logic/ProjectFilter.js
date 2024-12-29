export const ProjectFilter = (function() {
    const weekms = 604800000; // Week in milliseconds
    const todayDate = new Date((new Date()).toDateString()); // toDateString to set time to 12 midnight of the current day
    const nextWeekDate = new Date(todayDate.getTime() + weekms);

    function filterTasksToday(project) {
        const projectCopy = { ...project };
        projectCopy.tasks = project.tasks.filter((task) => task.dueDate.getTime() === todayDate.getTime());
        return projectCopy;
    }

    function filterTasksThisWeek(project) {
        const projectCopy = { ...project };
        projectCopy.tasks = project.tasks.filter((task) => task.dueDate >= todayDate && task.dueDate < nextWeekDate);
        return projectCopy;
    }

    function filterImportantTasks(project) {
        const projectCopy = { ...project };
        projectCopy.tasks = project.tasks.filter((task) => task.isPriority === true);
        return projectCopy;
    }

    function filterIncompleteTasks(project) {
        const projectCopy = { ...project };
        projectCopy.tasks = project.tasks.filter((task) => task.isComplete === false);
        return projectCopy;
    }

    function filterOverdueTasks(project) {
        const projectCopy = { ...project };
        const dateToday = new Date(new Date().toDateString());
        projectCopy.tasks = project.tasks.filter((task) => task.dueDate < dateToday);
        return projectCopy;
    }

    return {
        filterTasksToday,
        filterTasksThisWeek,
        filterImportantTasks,
        filterIncompleteTasks,
        filterOverdueTasks
    };
})();