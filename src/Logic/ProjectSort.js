export const ProjectSort = (function() {
    function sortByDate(project) {
        const projectCopy = { ...project };
        projectCopy.tasks.sort((a, b) => a.dueDate - b.dueDate);
        return projectCopy;
    }

    return {
        sortByDate
    };
})();