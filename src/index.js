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
const addTaskButton = document.querySelector("#add-task-button");

const createTaskWindow = document.querySelector(".create-task-window");
const createProjectWindow = document.querySelector(".create-project-window");

const navManager = new NavManager(mainContainer, mainHeading, todoList);

(function() {
    loadAll();
})();

addTaskButton.onclick = () => {
    DomManager.showOverlayWindow(createTaskWindow);
};

addProjectButton.onclick = () => {
    DomManager.showOverlayWindow(createProjectWindow);
}

createTaskWindow.onclick = (e) => {
    e.stopPropagation();
}

createProjectWindow.onclick = (e) => {
    e.stopPropagation();
}

function loadAll()
{
    navManager.loadAllPage();

    allButton.disabled = true;
    todayButton.disabled = false;
    weekButton.disabled = false;

    addTaskButton.style.display = "block";
}

function loadToday()
{
    navManager.loadTodayPage();

    allButton.disabled = false;
    todayButton.disabled = true;
    weekButton.disabled = false;

    addTaskButton.style.display = "none";
}

function loadWeek()
{
    navManager.loadWeekPage();

    allButton.disabled = false;
    todayButton.disabled = false;
    weekButton.disabled = true;

    addTaskButton.style.display = "none";
}

allButton.onclick = loadAll;
todayButton.onclick = loadToday;
weekButton.onclick = loadWeek;