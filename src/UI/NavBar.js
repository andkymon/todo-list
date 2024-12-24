import { ToDoStorage } from '../logic/ToDoStorage.js';
import { Main } from './Main.js';

export class NavBar {
    //Clear Projects before displaying updated list
    static #clearProjects() {
        const navBtnWrappers = document.querySelectorAll("nav .btn-wrapper");
        for (const navBtnWrapper of navBtnWrappers) {
            if (navBtnWrapper.id === "all") { //"all" button is static
                continue;
            }
            navBtnWrapper.remove();
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
            navBtn.addEventListener("click", () => {
                this.#resetNavBtnStyles();
                navBtn.classList.add("selected");
                Main.updateTasks(index); 
            });
            
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
    static #resetNavBtnStyles() { 
        const navBtns = document.querySelectorAll(".nav-btn");
        for (const navBtn of navBtns) {
            navBtn.classList.remove("selected");
        }
    }
    static init() {
        //This event listener is declared here as it is only needed to be set once when document loads.
        const navBtnAll = document.querySelector("#all > .nav-btn");
        navBtnAll.addEventListener("click", () => {
            this.#resetNavBtnStyles();
            navBtnAll.classList.add("selected");
            Main.updateTasks(-1); 
        });
    }
}




