export class InvalidStyling {
    static showNameValidationError() {
        const nameInput = document.querySelector(".name-input"); //Check this for errors, it might only select the first .name-input encountered
        const nameValidationSpan = document.querySelector(".name-validation");
    
        nameInput.classList.add("invalid");
        nameValidationSpan.classList.add("invalid");
    
        nameValidationSpan.textContent = "Input must be 1 to 50 characters";
    }

    static clearInvalidStyles() {
        const invalids = document.querySelectorAll(".invalid");

        for (const invalid of invalids) {
            invalid.classList.remove("invalid");
        }
    }
}