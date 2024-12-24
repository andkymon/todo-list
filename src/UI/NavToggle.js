export class NavToggle {
    static #body = document.querySelector("body");
    static #nav = document.querySelector("nav");

    static #toggle = () => {
        if (this.#body.style.gridTemplateColumns === "360px 1fr") {
            this.#body.style.gridTemplateColumns = "0px 1fr";
            this.#nav.style.transform = "translateX(-360px)";
        } else {
            this.#body.style.gridTemplateColumns = "360px 1fr";
            this.#nav.style.transform = "none";
        }
    }

    static init() {
        // Initial body and nav styling
        this.#body.style.gridTemplateColumns = "360px 1fr";
        this.#nav.style.transform = "none";

        const navToggle = document.querySelector("#nav-toggle");
        navToggle.addEventListener("click", this.#toggle);
    }
}