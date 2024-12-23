import css from "./style.css"
import { ToDoStorage } from './logic/ToDoStorage.js';
import { ProjectFilter } from './logic/ProjectFilter.js';
import { ProjectSort } from './logic/ProjectSort.js';

//Nav Toggle
const navToggle = document.querySelector("#nav-toggle");
const body = document.querySelector("body")
const nav = document.querySelector("nav");
body.style.gridTemplateColumns = "360px 1fr";
nav.style.transform = "none";

function toggle() {
    if (body.style.gridTemplateColumns === "360px 1fr") {
        body.style.gridTemplateColumns = "0px 1fr";
        nav.style.transform = "translateX(-360px)";
    } else {
        body.style.gridTemplateColumns = "360px 1fr";
        nav.style.transform = "none";
    }
}

navToggle.addEventListener("click", toggle);

//Add Project Dialog
const addProjectBtn = document.querySelector("#add-project");
const addProjectDialog = document.querySelector("#project-dialog");
function showAddProjectDialog() {
    addProjectDialog.showModal();
}
addProjectBtn.addEventListener("click", showAddProjectDialog);

const closeBtn = document.querySelector(".close");
function hideAddProjectDialog() {
    clearInvalidStyles();
    addProjectDialog.close();
}
closeBtn.addEventListener("click", hideAddProjectDialog);

//Add Project Button
const projectConfirmBtn = document.querySelector("#project-dialog .confirm");
const projectInputName = document.querySelector("#project-input-name");

function addProject() {
    const name = projectInputName.value;
    const result = ToDoStorage.addProject(name);
    if (result === false) {
        showNameValidationError();
        return;
    }
    projectInputName.value = "";
    hideAddProjectDialog();
    updateProjects();
}
projectConfirmBtn.addEventListener("click", addProject);

//Validate inputs
function showNameValidationError() {
    const nameInput = document.querySelector(".name-input");
    const nameValidationSpan = document.querySelector(".name-validation");

    nameInput.classList.add("invalid");
    nameValidationSpan.classList.add("invalid");

    nameValidationSpan.textContent = "Input must be 1 to 50 characters";
}

function clearInvalidStyles() {
    const invalids = document.querySelectorAll(".invalid");
    for (const invalid of invalids) {
        invalid.classList.remove("invalid");
    }
}

//Display Projects
function updateProjects() {
    clearProjects();
    for (const project of ToDoStorage.projects) {
        const navBtn = document.createElement("button");
        navBtn.classList.add("nav-btn");
        navBtn.textContent = project.name;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("small-btn", "delete");

        const btnWrapper = document.createElement("div");
        btnWrapper.classList.add("btn-wrapper");

        btnWrapper.append(navBtn, deleteBtn);
        nav.append(btnWrapper);
    }
}

//Clear Projects
function clearProjects() {
    const navBtns = document.querySelectorAll("nav .btn-wrapper");
    for (const navBtn of navBtns) {
        if (navBtn.id === "all") {
            continue;
        }
        navBtn.remove();
    }
}









