export const InputValidator = (function() {
    function validateName(name) {
        const nameStr = name.toString();
        if (nameStr === "" || nameStr.length > 50) {
            console.error("Input must be 1 to 50 characters");
            return false;
        }
        return true;
    }

    function validateDescription(description) {
        const descriptionStr = description.toString();
        if (descriptionStr.length > 255) {
            console.error("Input must be 0 to 255 characters");
            return false;
        }
        return true;
    }

    function validateDate(date) {
        if (isNaN(date)) {
            console.error("Input format must be MM-DD-YYYY and valid");
            return false;
        }
        return true;
    }

    function validateBoolean(bool) {
        if (typeof bool !== "boolean") {
            console.error("Input must be of boolean data type");
            return false;
        }
        return true;
    }

    function validateList(index, total) {
        if (!Number.isInteger(index) || index < 0 || index >= total) {
            console.error("Invalid list item selected");
            return false;
        }
        return true;
    }

    function validateTask(name, description, dueDate, projectIndex, totalProjects) {
        const inputs = [
            validateName(name), 
            validateDescription(description),
            validateDate(dueDate),
            validateList(projectIndex, totalProjects)
        ];
        for (const input of inputs) {
            if (input === false) {
                return false;
            }
        }
        return true;
    }

    return {
        validateName,
        validateDescription,
        validateDate,
        validateBoolean,
        validateList,
        validateTask
    };
})();
