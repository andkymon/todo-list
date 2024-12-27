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

    static #resetNavBtnStyles() { 
        /*Not a static variable because it has to query for an updated list 
        everytime this method is called*/
        const navBtns = document.querySelectorAll(".nav-btn");
        for (const navBtn of navBtns) {
            navBtn.classList.remove("selected");
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
                this.#disableSelectedBtn();
                Main.showButtons();
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

    static #disableSelectedBtn() {
        /*Not a static variable because it has to query for an updated list 
        everytime this method is called*/
        const navBtns = document.querySelectorAll(".nav-btn");
        for (const [i, navBtn] of navBtns.entries()) {
            navBtns[i].disabled = navBtns[i].classList.contains("selected");
        }
    }
    
    static getSelectedProjectIndex() {
        /*Not a static variable because it has to query for an updated list 
        everytime this method is called*/
        const navBtns = document.querySelectorAll("nav > .btn-wrapper:not(#all) > .nav-btn"); //Exclude "all" tab
        for (const [projectIndex, navBtn] of navBtns.entries()) {
            if (navBtn.classList.contains("selected")) {
                return projectIndex;
            }
        }
    }
    
    static init() {
        //This event listener is declared here as it is only needed to be set once when document loads.
        const navBtnAll = document.querySelector("#all > .nav-btn");
        navBtnAll.addEventListener("click", () => {
            this.#resetNavBtnStyles();
            navBtnAll.classList.add("selected");
            this.#disableSelectedBtn();
            Main.hideButtons();
            Main.updateTasks(-1); 
        });
        navBtnAll.click();
    }
}




