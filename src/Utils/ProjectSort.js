export const ProjectSort = (function() {
    function sortByDate(project) {
        project.tasks.sort((a, b) => a.dueDate - b.dueDate);
    }

    return {
        sortByDate
    }
})();