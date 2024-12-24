import { ToDoStorage } from '../logic/ToDoStorage.js';

export class NavBar {
    //Clear Projects before displaying updated list
    static #clearProjects() {
        const navBtns = document.querySelectorAll("nav .btn-wrapper");
        for (const navBtn of navBtns) {
            if (navBtn.id === "all") {
                continue;
            }
            navBtn.remove();
        }
    }
    //Display projects based on ToDoStorage.projects content
    static updateProjects() {
        this.#clearProjects();
        for (const [index, project] of ToDoStorage.projects.entries()) {
            const navBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");
            const btnWrapper = document.createElement("div");
            const nav = document.querySelector("nav");
            const transitionTime = 300;

            navBtn.classList.add("nav-btn");
            navBtn.textContent = project.name;
            
            deleteBtn.classList.add("small-btn", "delete");
            deleteBtn.addEventListener("click", () => {
                if (confirm(`Delete ${project.name}?`) === true) {
                    ToDoStorage.removeProject(index);
                    btnWrapper.classList.add("removed");
                    setTimeout(() => {
                        this.updateProjects();
                    }, transitionTime);
                } else {
                    return;
                }
            });

            btnWrapper.classList.add("btn-wrapper");
            btnWrapper.style.transition = `${transitionTime}ms`;

            btnWrapper.append(navBtn, deleteBtn);
            nav.append(btnWrapper);
        }
    }
}




