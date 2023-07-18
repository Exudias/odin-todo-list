/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/dateManager.js":
/*!************************************!*\
  !*** ./src/modules/dateManager.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomDate: () => (/* binding */ CustomDate),
/* harmony export */   DateManager: () => (/* binding */ DateManager)
/* harmony export */ });
class CustomDate
{
    constructor(day, month, year)
    {
        this.day = day;
        this.month = month;
        this.year = year;

        this.week = this.getWeekFromDate();
    }

    static createFromDateObject(date)
    {
        if (!date)
        {
            date = new Date();
        }
        return new CustomDate(date.getDate(), date.getMonth(), date.getFullYear());
    }

    getWeekFromDate()
    {
        let currentDate = new Date(this.year, this.month, this.day, new Date().getHours(), new Date().getMinutes());
        let beginningOfYear = new Date(this.year, 0, 1);
        let days = Math.floor((currentDate - beginningOfYear) / (24 * 60 * 60 * 1000));
        
        let weekNumber = Math.ceil(days / 7);
        
        return weekNumber;
    }

    getStringFromDate()
    {
        let day = this.day.toString().padStart(2, "0");
        let month = this.month.toString().padStart(2, "0");
        return `${day}.${month} ${this.year}`;
    }
}

class DateManager
{
    static getTodayDate()
    {
        let date = new Date();
        return new CustomDate(date.getDate(), date.getMonth(), date.getFullYear());
    }

    static getTodayWeek()
    {
        return this.getTodayDate().getWeekFromDate();
    }

    static areDatesEqual(date1, date2)
    {
        if (!date1 || !date2) return false;
        return date1.day === date2.day && 
               date1.month === date2.month && 
               date1.year === date2.year;
    }
}



/***/ }),

/***/ "./src/modules/dom.js":
/*!****************************!*\
  !*** ./src/modules/dom.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _todos__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todos */ "./src/modules/todos.js");


class DomManager
{
    static openOverlay = null;

    static 
    {
        this.loadDOMReferences();
        this.assignDOMEvents();
    }

    static loadDOMReferences()
    {
        this.dimmer = document.querySelector(".dimmer");
        this.taskForm = document.querySelector("#task-form");
        this.projectForm = document.querySelector("#project-form");
    }

    static assignDOMEvents()
    {
        this.dimmer.onclick = (e) => {
            e.stopPropagation();
            DomManager.hideOverlayWindow();
        };

        this.taskForm.onsubmit = (e) => {
            e.preventDefault();
            const formValid = this.taskForm.reportValidity();
            if (formValid)
            {
                const formValues = DomManager.getFormValues(this.taskForm);
        
                _todos__WEBPACK_IMPORTED_MODULE_0__["default"].createTodo(formValues.title, formValues.description, formValues.date, 0, "");
            }
        };

        this.projectForm.onsubmit = (e) => {
            e.preventDefault();
            const formValid = this.projectForm.reportValidity();
            if (formValid)
            {
                const formValues = DomManager.getFormValues(this.projectForm);
        
                _todos__WEBPACK_IMPORTED_MODULE_0__["default"].createProject(formValues.title);
            }
        };
    }

    static showOverlayWindow = (windowNode) =>
    {
        this.dimmer.style.display = "block";
        windowNode.style.display = "flex";
        this.openOverlay = windowNode;
    }

    static hideOverlayWindow = () =>
    {
        this.dimmer.style.display = "none";
        if (this.openOverlay)
        {
            this.openOverlay.style.display = "none";
        }
    }

    static getFormValues(form)
    {
        const data = new FormData(form);
        let res = {};
        for (const [key, value] of data)
        {
            res[key] = value;
        }
        return res;
    }

    static createNavButton(text)
    {
        const li = document.createElement("li");
        li.textContent = text;
        li.className = "nav-button";
        return li;
    }

    static createTodoItem(name)
    {
        const li = document.createElement("li");;
        li.className = "todo-item";

        const todoCompleteButtonContainer = createTodoButtonContainer("✓");
        li.appendChild(todoCompleteButtonContainer);

        const todoName = document.createElement("div");
        todoName.className = "todo-name";
        todoName.textContent = name;
        li.appendChild(todoName);

        const todoDate = document.createElement("div");
        todoDate.className = "todo-date";
        todoDate.textContent = "No date";
        li.appendChild(todoDate);

        const todoRemoveButtonContainer = createTodoButtonContainer("X");
        li.appendChild(todoRemoveButtonContainer);

        return {li, todoCompleteButtonContainer, todoRemoveButtonContainer};

        function createTodoButtonContainer(buttonText)
        {
            const todoButtonContainer = document.createElement("div");
            todoButtonContainer.className = "todo-button-container";

            const btn = document.createElement("button");
            btn.className = "todo-button";
            btn.tabIndex = -1;
            btn.textContent = buttonText;
            todoButtonContainer.appendChild(btn);
            return todoButtonContainer;
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomManager);

/***/ }),

/***/ "./src/modules/nav.js":
/*!****************************!*\
  !*** ./src/modules/nav.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/modules/dom.js");
/* harmony import */ var _todos__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./todos */ "./src/modules/todos.js");



class NavManager
{
    constructor(container, heading, todoList)
    {
        this.container = container;
        this.heading = heading;
        this.todoList = todoList;
    }

    loadAllPage()
    {
        this.heading.textContent = "All tasks";

        this.loadAndAssignTodosFromList(_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getAllTodos());
    }

    loadAndAssignTodosFromList(todos)
    {
        this.todoList.innerHTML = "";
        todos.forEach(todo => {
            const {li, todoCompleteButtonContainer, todoRemoveButtonContainer} = _dom__WEBPACK_IMPORTED_MODULE_0__["default"].createTodoItem(todo.title);
            todoCompleteButtonContainer.onclick = () => {
                this.todoList.removeChild(li);
                _todos__WEBPACK_IMPORTED_MODULE_1__["default"].removeTodo(todo.title);
            }
            todoRemoveButtonContainer.onclick = () => {
                this.todoList.removeChild(li);
                _todos__WEBPACK_IMPORTED_MODULE_1__["default"].removeTodo(todo.title);
            }
            this.todoList.appendChild(li);
        });
    }

    loadTodayPage()
    {
        this.heading.textContent = "Today's tasks";

        this.loadAndAssignTodosFromList(_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getTodosFromToday());
    }

    loadWeekPage()
    {
        this.heading.textContent = "This week's tasks";

        this.loadAndAssignTodosFromList(_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getTodosFromThisWeek());
    }

    loadProjectPage(name)
    {
        this.heading.textContent = `${name}'s todos`;
        this.todoList.innerHTML = "";

        
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NavManager);

/***/ }),

/***/ "./src/modules/todos.js":
/*!******************************!*\
  !*** ./src/modules/todos.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dateManager */ "./src/modules/dateManager.js");


class Todo {
    constructor(title, description, dueDate, priority, project)
    {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
    }

    setDate(val)
    {
        this.dueDate = val;
    }

    setProject(val)
    {
        this.project = val;
    }
}

class DataManager {
    static todos = [];
    static projects = [];

    static
    {
        this.loadData();
    }

    static loadData()
    {
        // Load dummy data for now
        this.createTodo("Gimli1", "A dwarf's task 1", new _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate(17, 6, 2023), 2, "Dwarven Stuff");
        this.createTodo("Gimli2", "A dwarf's task 2", new _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate(18, 6, 2023), 3, "Dwarven Stuff");
        this.createTodo("Gimli3", "A dwarf's task 3", new _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate(24, 6, 2023), 4, "Elven Stuff");
    }

    static createProject(name)
    {
        if (name)
        {
            if (this.projects.includes(name))
            {
                alert("Project already exists!");
            }
            else
            {
                this.projects.push(name);
            }
        }
        else
        {
            alert("Invalid project name!");
        }
    }

    static createTodo(title, description, dueDate, priority, project)
    {
        for (let i = 0; i < this.todos.length; i++)
        {
            if (this.todos[i].title === title)
            {
                alert("Task name must be unique!");
                return;
            }
        }

        if (!(dueDate instanceof _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate))
        {
            dueDate = _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate.createFromDateObject(dueDate);
        }

        let todo = new Todo(title, description, dueDate, priority, project);
        this.todos.push(todo);
        console.log(this.todos);
    }

    static getAllTodos()
    {
        return this.todos;
    }

    static getTodosFromToday()
    {
        let today = _dateManager__WEBPACK_IMPORTED_MODULE_0__.DateManager.getTodayDate();

        let out = [];
        for (let i = 0; i < this.todos.length; i++)
        {
            if (_dateManager__WEBPACK_IMPORTED_MODULE_0__.DateManager.areDatesEqual(today, this.todos[i].dueDate))
            {
                
                out.push(this.todos[i]);
            }
        }
        return out;
    }

    static getTodosFromThisWeek()
    {
        let todayWeek = _dateManager__WEBPACK_IMPORTED_MODULE_0__.DateManager.getTodayWeek();

        let out = [];
        for (let i = 0; i < this.todos.length; i++)
        {
            if (this.todos[i].dueDate.week === todayWeek)
            {
                out.push(this.todos[i]);
            }
        }
        return out;
    }

    static removeTodo(name)
    {
        for (let i = 0; i < this.todos.length; i++)
        {
            if (this.todos[i].title === name)
            {
                this.todos.splice(i, 1);
            }
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DataManager);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_dateManager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/dateManager.js */ "./src/modules/dateManager.js");
/* harmony import */ var _modules_dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/dom.js */ "./src/modules/dom.js");
/* harmony import */ var _modules_nav_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/nav.js */ "./src/modules/nav.js");




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

const navManager = new _modules_nav_js__WEBPACK_IMPORTED_MODULE_2__["default"](mainContainer, mainHeading, todoList);

(function() {
    loadAll();
})();

addTaskButton.onclick = () => {
    _modules_dom_js__WEBPACK_IMPORTED_MODULE_1__["default"].showOverlayWindow(createTaskWindow);
};

addProjectButton.onclick = () => {
    _modules_dom_js__WEBPACK_IMPORTED_MODULE_1__["default"].showOverlayWindow(createProjectWindow);
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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLElBQUksR0FBRyxPQUFPLEVBQUUsVUFBVTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzVEa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiw4Q0FBVztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiw4Q0FBVztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7O0FDMUhNO0FBQ0c7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qyw4Q0FBVztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsNERBQTRELEVBQUUsNENBQVU7QUFDM0Y7QUFDQTtBQUNBLGdCQUFnQiw4Q0FBVztBQUMzQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsOENBQVc7QUFDM0I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsOENBQVc7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLDhDQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLEtBQUs7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsVUFBVTs7Ozs7Ozs7Ozs7Ozs7O0FDM0Q2QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRCxvREFBVTtBQUNwRSwwREFBMEQsb0RBQVU7QUFDcEUsMERBQTBELG9EQUFVO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsb0RBQVU7QUFDM0M7QUFDQSxzQkFBc0Isb0RBQVU7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixxREFBVztBQUMvQjtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBLGdCQUFnQixxREFBVztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxREFBVztBQUNuQztBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxXQUFXOzs7Ozs7VUNoSTFCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ051RDtBQUNiO0FBQ0E7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdURBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxJQUFJLHVEQUFVO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsSUFBSSx1REFBVTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9kYXRlTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL25hdi5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3RvZG9zLmpzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ3VzdG9tRGF0ZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihkYXksIG1vbnRoLCB5ZWFyKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGF5ID0gZGF5O1xyXG4gICAgICAgIHRoaXMubW9udGggPSBtb250aDtcclxuICAgICAgICB0aGlzLnllYXIgPSB5ZWFyO1xyXG5cclxuICAgICAgICB0aGlzLndlZWsgPSB0aGlzLmdldFdlZWtGcm9tRGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVGcm9tRGF0ZU9iamVjdChkYXRlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEN1c3RvbURhdGUoZGF0ZS5nZXREYXRlKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXRGdWxsWWVhcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRXZWVrRnJvbURhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKHRoaXMueWVhciwgdGhpcy5tb250aCwgdGhpcy5kYXksIG5ldyBEYXRlKCkuZ2V0SG91cnMoKSwgbmV3IERhdGUoKS5nZXRNaW51dGVzKCkpO1xyXG4gICAgICAgIGxldCBiZWdpbm5pbmdPZlllYXIgPSBuZXcgRGF0ZSh0aGlzLnllYXIsIDAsIDEpO1xyXG4gICAgICAgIGxldCBkYXlzID0gTWF0aC5mbG9vcigoY3VycmVudERhdGUgLSBiZWdpbm5pbmdPZlllYXIpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgd2Vla051bWJlciA9IE1hdGguY2VpbChkYXlzIC8gNyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHdlZWtOdW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3RyaW5nRnJvbURhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBkYXkgPSB0aGlzLmRheS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcclxuICAgICAgICBsZXQgbW9udGggPSB0aGlzLm1vbnRoLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpO1xyXG4gICAgICAgIHJldHVybiBgJHtkYXl9LiR7bW9udGh9ICR7dGhpcy55ZWFyfWA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERhdGVNYW5hZ2VyXHJcbntcclxuICAgIHN0YXRpYyBnZXRUb2RheURhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICByZXR1cm4gbmV3IEN1c3RvbURhdGUoZGF0ZS5nZXREYXRlKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXRGdWxsWWVhcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0VG9kYXlXZWVrKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb2RheURhdGUoKS5nZXRXZWVrRnJvbURhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXJlRGF0ZXNFcXVhbChkYXRlMSwgZGF0ZTIpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFkYXRlMSB8fCAhZGF0ZTIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gZGF0ZTEuZGF5ID09PSBkYXRlMi5kYXkgJiYgXHJcbiAgICAgICAgICAgICAgIGRhdGUxLm1vbnRoID09PSBkYXRlMi5tb250aCAmJiBcclxuICAgICAgICAgICAgICAgZGF0ZTEueWVhciA9PT0gZGF0ZTIueWVhcjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtEYXRlTWFuYWdlciwgQ3VzdG9tRGF0ZX07IiwiaW1wb3J0IERhdGFNYW5hZ2VyIGZyb20gXCIuL3RvZG9zXCI7XHJcblxyXG5jbGFzcyBEb21NYW5hZ2VyXHJcbntcclxuICAgIHN0YXRpYyBvcGVuT3ZlcmxheSA9IG51bGw7XHJcblxyXG4gICAgc3RhdGljIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubG9hZERPTVJlZmVyZW5jZXMoKTtcclxuICAgICAgICB0aGlzLmFzc2lnbkRPTUV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkRE9NUmVmZXJlbmNlcygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kaW1tZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpbW1lclwiKTtcclxuICAgICAgICB0aGlzLnRhc2tGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrLWZvcm1cIik7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvamVjdC1mb3JtXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3NpZ25ET01FdmVudHMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGltbWVyLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBEb21NYW5hZ2VyLmhpZGVPdmVybGF5V2luZG93KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy50YXNrRm9ybS5vbnN1Ym1pdCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc3QgZm9ybVZhbGlkID0gdGhpcy50YXNrRm9ybS5yZXBvcnRWYWxpZGl0eSgpO1xyXG4gICAgICAgICAgICBpZiAoZm9ybVZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtVmFsdWVzID0gRG9tTWFuYWdlci5nZXRGb3JtVmFsdWVzKHRoaXMudGFza0Zvcm0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuY3JlYXRlVG9kbyhmb3JtVmFsdWVzLnRpdGxlLCBmb3JtVmFsdWVzLmRlc2NyaXB0aW9uLCBmb3JtVmFsdWVzLmRhdGUsIDAsIFwiXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0Rm9ybS5vbnN1Ym1pdCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc3QgZm9ybVZhbGlkID0gdGhpcy5wcm9qZWN0Rm9ybS5yZXBvcnRWYWxpZGl0eSgpO1xyXG4gICAgICAgICAgICBpZiAoZm9ybVZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtVmFsdWVzID0gRG9tTWFuYWdlci5nZXRGb3JtVmFsdWVzKHRoaXMucHJvamVjdEZvcm0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuY3JlYXRlUHJvamVjdChmb3JtVmFsdWVzLnRpdGxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNob3dPdmVybGF5V2luZG93ID0gKHdpbmRvd05vZGUpID0+XHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kaW1tZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICB3aW5kb3dOb2RlLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgICAgICB0aGlzLm9wZW5PdmVybGF5ID0gd2luZG93Tm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaGlkZU92ZXJsYXlXaW5kb3cgPSAoKSA9PlxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGltbWVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICBpZiAodGhpcy5vcGVuT3ZlcmxheSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMub3Blbk92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0Rm9ybVZhbHVlcyhmb3JtKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcbiAgICAgICAgbGV0IHJlcyA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXNba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVOYXZCdXR0b24odGV4dClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgICBsaS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgbGkuY2xhc3NOYW1lID0gXCJuYXYtYnV0dG9uXCI7XHJcbiAgICAgICAgcmV0dXJuIGxpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVUb2RvSXRlbShuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpOztcclxuICAgICAgICBsaS5jbGFzc05hbWUgPSBcInRvZG8taXRlbVwiO1xyXG5cclxuICAgICAgICBjb25zdCB0b2RvQ29tcGxldGVCdXR0b25Db250YWluZXIgPSBjcmVhdGVUb2RvQnV0dG9uQ29udGFpbmVyKFwi4pyTXCIpO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9OYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0b2RvTmFtZS5jbGFzc05hbWUgPSBcInRvZG8tbmFtZVwiO1xyXG4gICAgICAgIHRvZG9OYW1lLnRleHRDb250ZW50ID0gbmFtZTtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZCh0b2RvTmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9EYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0b2RvRGF0ZS5jbGFzc05hbWUgPSBcInRvZG8tZGF0ZVwiO1xyXG4gICAgICAgIHRvZG9EYXRlLnRleHRDb250ZW50ID0gXCJObyBkYXRlXCI7XHJcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQodG9kb0RhdGUpO1xyXG5cclxuICAgICAgICBjb25zdCB0b2RvUmVtb3ZlQnV0dG9uQ29udGFpbmVyID0gY3JlYXRlVG9kb0J1dHRvbkNvbnRhaW5lcihcIlhcIik7XHJcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQodG9kb1JlbW92ZUJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIHJldHVybiB7bGksIHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lciwgdG9kb1JlbW92ZUJ1dHRvbkNvbnRhaW5lcn07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVRvZG9CdXR0b25Db250YWluZXIoYnV0dG9uVGV4dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvZG9CdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICB0b2RvQnV0dG9uQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwidG9kby1idXR0b24tY29udGFpbmVyXCI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgICAgICBidG4uY2xhc3NOYW1lID0gXCJ0b2RvLWJ1dHRvblwiO1xyXG4gICAgICAgICAgICBidG4udGFiSW5kZXggPSAtMTtcclxuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gYnV0dG9uVGV4dDtcclxuICAgICAgICAgICAgdG9kb0J1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChidG4pO1xyXG4gICAgICAgICAgICByZXR1cm4gdG9kb0J1dHRvbkNvbnRhaW5lcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERvbU1hbmFnZXI7IiwiaW1wb3J0IERvbU1hbmFnZXIgZnJvbSBcIi4vZG9tXCI7XHJcbmltcG9ydCBEYXRhTWFuYWdlciBmcm9tIFwiLi90b2Rvc1wiO1xyXG5cclxuY2xhc3MgTmF2TWFuYWdlclxyXG57XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGhlYWRpbmcsIHRvZG9MaXN0KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuaGVhZGluZyA9IGhlYWRpbmc7XHJcbiAgICAgICAgdGhpcy50b2RvTGlzdCA9IHRvZG9MaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRBbGxQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBcIkFsbCB0YXNrc1wiO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KERhdGFNYW5hZ2VyLmdldEFsbFRvZG9zKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KHRvZG9zKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudG9kb0xpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0b2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7bGksIHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lciwgdG9kb1JlbW92ZUJ1dHRvbkNvbnRhaW5lcn0gPSBEb21NYW5hZ2VyLmNyZWF0ZVRvZG9JdGVtKHRvZG8udGl0bGUpO1xyXG4gICAgICAgICAgICB0b2RvQ29tcGxldGVCdXR0b25Db250YWluZXIub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9kb0xpc3QucmVtb3ZlQ2hpbGQobGkpO1xyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIucmVtb3ZlVG9kbyh0b2RvLnRpdGxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0b2RvUmVtb3ZlQnV0dG9uQ29udGFpbmVyLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG9MaXN0LnJlbW92ZUNoaWxkKGxpKTtcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLnJlbW92ZVRvZG8odG9kby50aXRsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50b2RvTGlzdC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFRvZGF5UGFnZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nLnRleHRDb250ZW50ID0gXCJUb2RheSdzIHRhc2tzXCI7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QoRGF0YU1hbmFnZXIuZ2V0VG9kb3NGcm9tVG9kYXkoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFdlZWtQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBcIlRoaXMgd2VlaydzIHRhc2tzXCI7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QoRGF0YU1hbmFnZXIuZ2V0VG9kb3NGcm9tVGhpc1dlZWsoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFByb2plY3RQYWdlKG5hbWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nLnRleHRDb250ZW50ID0gYCR7bmFtZX0ncyB0b2Rvc2A7XHJcbiAgICAgICAgdGhpcy50b2RvTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmF2TWFuYWdlcjsiLCJpbXBvcnQge0RhdGVNYW5hZ2VyLCBDdXN0b21EYXRlfSBmcm9tIFwiLi9kYXRlTWFuYWdlclwiO1xyXG5cclxuY2xhc3MgVG9kbyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICAgICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTtcclxuICAgICAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRlKHZhbClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmR1ZURhdGUgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJvamVjdCh2YWwpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gdmFsO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBEYXRhTWFuYWdlciB7XHJcbiAgICBzdGF0aWMgdG9kb3MgPSBbXTtcclxuICAgIHN0YXRpYyBwcm9qZWN0cyA9IFtdO1xyXG5cclxuICAgIHN0YXRpY1xyXG4gICAge1xyXG4gICAgICAgIHRoaXMubG9hZERhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZERhdGEoKVxyXG4gICAge1xyXG4gICAgICAgIC8vIExvYWQgZHVtbXkgZGF0YSBmb3Igbm93XHJcbiAgICAgICAgdGhpcy5jcmVhdGVUb2RvKFwiR2ltbGkxXCIsIFwiQSBkd2FyZidzIHRhc2sgMVwiLCBuZXcgQ3VzdG9tRGF0ZSgxNywgNiwgMjAyMyksIDIsIFwiRHdhcnZlbiBTdHVmZlwiKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVRvZG8oXCJHaW1saTJcIiwgXCJBIGR3YXJmJ3MgdGFzayAyXCIsIG5ldyBDdXN0b21EYXRlKDE4LCA2LCAyMDIzKSwgMywgXCJEd2FydmVuIFN0dWZmXCIpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlVG9kbyhcIkdpbWxpM1wiLCBcIkEgZHdhcmYncyB0YXNrIDNcIiwgbmV3IEN1c3RvbURhdGUoMjQsIDYsIDIwMjMpLCA0LCBcIkVsdmVuIFN0dWZmXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVQcm9qZWN0KG5hbWUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0cy5pbmNsdWRlcyhuYW1lKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQcm9qZWN0IGFscmVhZHkgZXhpc3RzIVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdHMucHVzaChuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhbGVydChcIkludmFsaWQgcHJvamVjdCBuYW1lIVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZVRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgcHJvamVjdClcclxuICAgIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS50aXRsZSA9PT0gdGl0bGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGFzayBuYW1lIG11c3QgYmUgdW5pcXVlIVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEoZHVlRGF0ZSBpbnN0YW5jZW9mIEN1c3RvbURhdGUpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZHVlRGF0ZSA9IEN1c3RvbURhdGUuY3JlYXRlRnJvbURhdGVPYmplY3QoZHVlRGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdG9kbyA9IG5ldyBUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHByb2plY3QpO1xyXG4gICAgICAgIHRoaXMudG9kb3MucHVzaCh0b2RvKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnRvZG9zKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0QWxsVG9kb3MoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvZG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2Rvc0Zyb21Ub2RheSgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHRvZGF5ID0gRGF0ZU1hbmFnZXIuZ2V0VG9kYXlEYXRlKCk7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoRGF0ZU1hbmFnZXIuYXJlRGF0ZXNFcXVhbCh0b2RheSwgdGhpcy50b2Rvc1tpXS5kdWVEYXRlKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBvdXQucHVzaCh0aGlzLnRvZG9zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2Rvc0Zyb21UaGlzV2VlaygpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHRvZGF5V2VlayA9IERhdGVNYW5hZ2VyLmdldFRvZGF5V2VlaygpO1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9kb3NbaV0uZHVlRGF0ZS53ZWVrID09PSB0b2RheVdlZWspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG91dC5wdXNoKHRoaXMudG9kb3NbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlbW92ZVRvZG8obmFtZSlcclxuICAgIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS50aXRsZSA9PT0gbmFtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGFNYW5hZ2VyOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgRGF0ZU1hbmFnZXIgfSBmcm9tICcuL21vZHVsZXMvZGF0ZU1hbmFnZXIuanMnO1xyXG5pbXBvcnQgRG9tTWFuYWdlciBmcm9tICcuL21vZHVsZXMvZG9tLmpzJztcclxuaW1wb3J0IE5hdk1hbmFnZXIgZnJvbSAnLi9tb2R1bGVzL25hdi5qcyc7XHJcblxyXG4vLyBET00gUmVmZXJlbmNlc1xyXG5jb25zdCBhbGxCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FsbC1idXR0b25cIik7XHJcbmNvbnN0IHRvZGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0b2RheS1idXR0b25cIik7XHJcbmNvbnN0IHdlZWtCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dlZWstYnV0dG9uXCIpO1xyXG5cclxuY29uc3QgYWRkUHJvamVjdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWRkLXByb2plY3QtYnV0dG9uXCIpO1xyXG5cclxuY29uc3QgcHJvamVjdHNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcm9qZWN0cy1saXN0XCIpO1xyXG5cclxuY29uc3QgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1ib2R5LWNvbnRhaW5lclwiKTtcclxuXHJcbmNvbnN0IG1haW5IZWFkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWJvZHktY29udGFpbmVyIC5wYW5lbC1oZWFkaW5nXCIpO1xyXG5jb25zdCB0b2RvTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kby1saXN0XCIpO1xyXG5jb25zdCBhZGRUYXNrQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZGQtdGFzay1idXR0b25cIik7XHJcblxyXG5jb25zdCBjcmVhdGVUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jcmVhdGUtdGFzay13aW5kb3dcIik7XHJcbmNvbnN0IGNyZWF0ZVByb2plY3RXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNyZWF0ZS1wcm9qZWN0LXdpbmRvd1wiKTtcclxuXHJcbmNvbnN0IG5hdk1hbmFnZXIgPSBuZXcgTmF2TWFuYWdlcihtYWluQ29udGFpbmVyLCBtYWluSGVhZGluZywgdG9kb0xpc3QpO1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgbG9hZEFsbCgpO1xyXG59KSgpO1xyXG5cclxuYWRkVGFza0J1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgRG9tTWFuYWdlci5zaG93T3ZlcmxheVdpbmRvdyhjcmVhdGVUYXNrV2luZG93KTtcclxufTtcclxuXHJcbmFkZFByb2plY3RCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgIERvbU1hbmFnZXIuc2hvd092ZXJsYXlXaW5kb3coY3JlYXRlUHJvamVjdFdpbmRvdyk7XHJcbn1cclxuXHJcbmNyZWF0ZVRhc2tXaW5kb3cub25jbGljayA9IChlKSA9PiB7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG59XHJcblxyXG5jcmVhdGVQcm9qZWN0V2luZG93Lm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEFsbCgpXHJcbntcclxuICAgIG5hdk1hbmFnZXIubG9hZEFsbFBhZ2UoKTtcclxuXHJcbiAgICBhbGxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgdG9kYXlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIHdlZWtCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICBhZGRUYXNrQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRUb2RheSgpXHJcbntcclxuICAgIG5hdk1hbmFnZXIubG9hZFRvZGF5UGFnZSgpO1xyXG5cclxuICAgIGFsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgdG9kYXlCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgd2Vla0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgIGFkZFRhc2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkV2VlaygpXHJcbntcclxuICAgIG5hdk1hbmFnZXIubG9hZFdlZWtQYWdlKCk7XHJcblxyXG4gICAgYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB0b2RheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgd2Vla0J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gICAgYWRkVGFza0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn1cclxuXHJcbmFsbEJ1dHRvbi5vbmNsaWNrID0gbG9hZEFsbDtcclxudG9kYXlCdXR0b24ub25jbGljayA9IGxvYWRUb2RheTtcclxud2Vla0J1dHRvbi5vbmNsaWNrID0gbG9hZFdlZWs7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9