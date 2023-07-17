import DomManager from './modules/dom.js';

// DOM References
const allButton = document.querySelector("#all-button");
const todayButton = document.querySelector("#today-button");
const weekButton = document.querySelector("#week-button");

const addProjectButton = document.querySelector("#add-project-button");

const projectsList = document.querySelector(".projects-list");

const mainContainer = document.querySelector(".main-body-container");

(function() {
    projectsList.appendChild(DomManager.createNavButton("Gimli 1"));
    projectsList.appendChild(DomManager.createNavButton("Gimli 2"));
    projectsList.appendChild(DomManager.createNavButton("Gimli 3"));
})();