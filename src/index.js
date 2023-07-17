import { DateManager } from './modules/dateManager.js';
import DomManager from './modules/dom.js';
import NavManager from './modules/nav.js';

// DOM References
const allButton = document.querySelector("#all-button");
const todayButton = document.querySelector("#today-button");
const weekButton = document.querySelector("#week-button");

const addProjectButton = document.querySelector("#add-project-button");

const projectsList = document.querySelector(".projects-list");

const mainContainer = document.querySelector(".main-body-container");

const mainHeading = document.querySelector(".main-body-container .panel-heading");
const todoList = document.querySelector(".todo-list");

const navManager = new NavManager(mainContainer, mainHeading, todoList);

(function() {
    loadAll();
})();

function loadAll()
{
    navManager.loadAllPage();
    allButton.disabled = true;
    todayButton.disabled = false;
    weekButton.disabled = false;
}

function loadToday()
{
    navManager.loadTodayPage();
    allButton.disabled = false;
    todayButton.disabled = true;
    weekButton.disabled = false;
}

function loadWeek()
{
    navManager.loadWeekPage();
    allButton.disabled = false;
    todayButton.disabled = false;
    weekButton.disabled = true;
}

allButton.onclick = loadAll;
todayButton.onclick = loadToday;
weekButton.onclick = loadWeek;