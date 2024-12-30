export const InvalidStyling = (function () {
    function showValidationError(input, type) {
        //Target adjacent sibling .validation div
        const validationSpan = document.querySelector("#" + input.id + " + .validation");
    
        input.classList.add("invalid");
        validationSpan.classList.add("invalid");
        
        switch (type) {
            case "name":
                validationSpan.textContent = "Input must be 1 to 50 characters";
                break;
            case "description":
                validationSpan.textContent = "Input must be 0 to 255 characters";
                break;
            case "date":
                validationSpan.textContent = "Select a date";
                break;
            default:
                console.error("Invalid type selected");
        }
    }

    function clearInvalidStyles() {
        const invalids = document.querySelectorAll(".invalid");

        for (const invalid of invalids) {
            invalid.classList.remove("invalid");
        }
    }

    return {
        showValidationError,
        clearInvalidStyles
    };
})();
