export class InputValidator {
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

    static validateList(index, total) {
        if (!Number.isInteger(index) || index < 0 || index >= total) {
            console.error("Invalid list item selected");
            return false;
        }
    }

    static validateTask(name, description, dueDate, isPriority, projectIndex, totalProjects) {
        const inputs = [this.validateName(name), 
                        this.validateDescription(description),
                        this.validateDate(dueDate),
                        this.validateBoolean(isPriority),
                        this.validateList(projectIndex, totalProjects)
                        ];
        for (const input of inputs) {
            if (input === false) {
                return false;
            }
        }
    }
}