export class ProjectSort {
    static sortByDate(project) {
        const projectCopy = {...project};
        projectCopy.tasks.sort((a, b) => a.dueDate - b.dueDate);
        return projectCopy;
    }
}