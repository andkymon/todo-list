export class ProjectSort {
    static sortByDate(project) {
        const projectCopy = {...project};
        projectCopy.tasks.sort((a, b) => a.dueDate - b.dueDate);
        return projectCopy;
    }
    static sortByImportance(project) {
        const projectCopy = this.sortByDate(project);
        projectCopy.tasks.sort((a, b) => b.isPriority - a.isPriority);
        return projectCopy;
    }

    static sortByCompletion(project) {
        const projectCopy = this.sortByDate(project);
        projectCopy.tasks.sort((a, b) => b.isComplete - a.isComplete);
        return projectCopy;
    }

    static sortByPending(project) {
        const projectCopy = this.sortByDate(project);
        projectCopy.tasks.sort((a, b) => a.isComplete - b.isComplete);
        return projectCopy;
    }
}