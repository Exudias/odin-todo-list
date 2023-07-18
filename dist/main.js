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
        let month = (this.month + 1).toString().padStart(2, "0");
        return `${day}/${month}/${this.year}`;
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
/* harmony import */ var _nav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nav */ "./src/modules/nav.js");



class DomManager
{
    static openOverlay = null;

    static 
    {
        this.loadDOMReferences();

        this.navManager = new _nav__WEBPACK_IMPORTED_MODULE_1__["default"](this.mainContainer, this.mainHeading, this.todoList, this.projectsList);
        
        this.assignDOMEvents();
    }

    static loadDOMReferences()
    {
        this.dimmer = document.querySelector(".dimmer");
        this.taskForm = document.querySelector("#task-form");
        this.projectForm = document.querySelector("#project-form");

        this.allButton = document.querySelector("#all-button");
        this.todayButton = document.querySelector("#today-button");
        this.weekButton = document.querySelector("#week-button");

        this.addProjectButton = document.querySelector("#add-project-button");

        this.projectsList = document.querySelector(".projects-list");

        this.mainContainer = document.querySelector(".main-body-container");

        this.mainHeading = document.querySelector(".main-body-container .panel-heading");
        this.todoList = document.querySelector(".todo-list");
        this.addTaskButton = document.querySelector("#add-task-button");

        this.createTaskWindow = document.querySelector(".create-task-window");
        this.taskDate = document.querySelector("#task-date");
        this.taskProject = document.querySelector("#task-project");
        this.createProjectWindow = document.querySelector(".create-project-window");

        this.resetTaskDate();
        this.resetTaskProject();
    }

    static resetTaskDate()
    {
        let today = new Date().toISOString().split("T")[0];
        this.taskDate.min = today;
        this.taskDate.value = today;
    }

    static resetTaskProject()
    {
        let projects = _todos__WEBPACK_IMPORTED_MODULE_0__["default"].getAllProjects();
        this.taskProject.innerHTML = "";
        projects.forEach(project => {
            this.taskProject.appendChild(this.createOption(project));
        });
        this.taskProject.children[0].selected = true;
    }

    static createOption(value)
    {
        let opt = document.createElement("option");
        opt.value = value;
        opt.textContent = value;
        return opt;
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
        
                _todos__WEBPACK_IMPORTED_MODULE_0__["default"].createTodo(formValues.title, formValues.description, new Date(formValues.date), 0, formValues.project);
                this.navManager.loadTodos();
                this.hideOverlayWindow();
            }
        };

        this.projectForm.onsubmit = (e) => {
            e.preventDefault();
            const formValid = this.projectForm.reportValidity();
            if (formValid)
            {
                const formValues = DomManager.getFormValues(this.projectForm);
        
                _todos__WEBPACK_IMPORTED_MODULE_0__["default"].createProject(formValues.title);
                this.navManager.loadProjects();
                this.hideOverlayWindow();
            }
        };

        this.addTaskButton.onclick = () => {
            this.showOverlayWindow(this.createTaskWindow);
        };
        
        this.addProjectButton.onclick = () => {
            this.showOverlayWindow(this.createProjectWindow);
        };
        
        this.createTaskWindow.onclick = (e) => {
            e.stopPropagation();
        };
        
        this.createProjectWindow.onclick = (e) => {
            e.stopPropagation();
        };

        this.allButton.onclick = () => {this.loadAllPage()};
        this.todayButton.onclick = () => {this.loadTodayPage()};
        this.weekButton.onclick = () => {this.loadWeekPage()};
    }

    static loadAllPage()
    {
        this.navManager.loadAllPage();
        this.navManager.loadProjects();
        
        this.allButton.disabled = true;
        this.todayButton.disabled = false;
        this.weekButton.disabled = false;
    
        this.addTaskButton.style.display = "block";
    }

    static loadTodayPage()
    {
        this.navManager.loadTodayPage();
        this.navManager.loadProjects();
        
        this.allButton.disabled = false;
        this.todayButton.disabled = true;
        this.weekButton.disabled = false;
    
        this.addTaskButton.style.display = "none";
    }

    static loadWeekPage()
    {
        this.navManager.loadWeekPage();
        this.navManager.loadProjects();
        
        this.allButton.disabled = false;
        this.todayButton.disabled = false;
        this.weekButton.disabled = true;
    
        this.addTaskButton.style.display = "none";
    }

    static loadProjectPage()
    {
        this.allButton.disabled = false;
        this.todayButton.disabled = false;
        this.weekButton.disabled = false;

        this.addTaskButton.style.display = "block";
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
        this.taskForm.reset();
        this.projectForm.reset();
        this.resetTaskDate();
        this.resetTaskProject();
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
        const li = document.createElement("button");
        li.textContent = text;
        li.className = "nav-button";
        return li;
    }

    static createTodoItem(name, date, project)
    {
        const li = document.createElement("li");;
        li.className = "todo-item";

        const todoCompleteButtonContainer = createTodoButtonContainer("✓");
        li.appendChild(todoCompleteButtonContainer);

        const todoName = document.createElement("div");
        todoName.className = "todo-name";
        todoName.textContent = `${name} (${project})`;
        li.appendChild(todoName);

        const todoDate = document.createElement("div");
        todoDate.className = "todo-date";
        todoDate.textContent = date.getStringFromDate();
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

    static enableAllPrimaryButtons()
    {
        this.allButton.disabled = false;
        this.todayButton.disabled = false;
        this.weekButton.disabled = false;
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
    currentPage;
    currentProject;

    constructor(container, heading, todoList, projectList)
    {
        this.container = container;
        this.heading = heading;
        this.todoList = todoList;
        this.projectList = projectList;

        this.projectButtons = [];
    }

    loadProjects()
    {
        let projects = _todos__WEBPACK_IMPORTED_MODULE_1__["default"].getAllProjects();
        this.projectList.innerHTML = "";
        this.projectButtons = [];
        projects.forEach(projectName => {
            let btn = _dom__WEBPACK_IMPORTED_MODULE_0__["default"].createNavButton(projectName);
            btn.onclick = () => {
                this.loadProjectPage(projectName);
                this.projectButtons.forEach(button => {
                    if (button)
                    {
                        button.disabled = false;
                    }
                });
                btn.disabled = true;
            };
            let btnRemove = document.createElement("button");
            btnRemove.className = "project-delete-button";
            btnRemove.textContent = "X";
            btn.appendChild(btnRemove);
            btnRemove.onclick = (e) => {
                e.stopPropagation();
                if (_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getAllProjects().length > 1)
                {
                    _todos__WEBPACK_IMPORTED_MODULE_1__["default"].removeProject(projectName);
                    this.loadTodos();
                    this.loadProjects();
                    this.loadAllPage();
                }
            }
            this.projectList.appendChild(btn);
            this.projectButtons.push(btn);
        });
    }

    loadTodos(projectName)
    {
        if (projectName)
        {
            this.currentProject = projectName;
        }
        if (this.currentPage === "All")
        {
            this.loadAndAssignTodosFromList(_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getAllTodos());
        }
        else if (this.currentPage === "Today")
        {
            this.loadAndAssignTodosFromList(_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getTodosFromToday());
        }
        else if (this.currentPage === "Week")
        {
            this.loadAndAssignTodosFromList(_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getTodosFromThisWeek());
        }
        else if (this.currentPage === "Project")
        {
            this.loadAndAssignTodosFromList(_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getTodosFromProject(this.currentProject));
        }
        else
        {
            console.log("[ERROR]: Loading todos for unknown page!");
        }
    }

    loadAndAssignTodosFromList(todos)
    {
        this.todoList.innerHTML = "";
        todos.forEach(todo => {
            const {li, todoCompleteButtonContainer, todoRemoveButtonContainer} = _dom__WEBPACK_IMPORTED_MODULE_0__["default"].createTodoItem(todo.title, todo.dueDate, todo.project);
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

    loadAllPage()
    {
        this.currentPage = "All";
        this.heading.textContent = "All tasks";

        this.loadTodos();
    }

    loadTodayPage()
    {
        this.currentPage = "Today";
        this.heading.textContent = "Today's tasks";

        this.loadTodos();
    }

    loadWeekPage()
    {
        this.currentPage = "Week";
        this.heading.textContent = "This week's tasks";

        this.loadTodos();
    }

    loadProjectPage(name)
    {
        this.currentPage = "Project";
        this.heading.textContent = `${name}'s todos`;

        this.loadTodos(name);
        _dom__WEBPACK_IMPORTED_MODULE_0__["default"].loadProjectPage();
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
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/modules/dom.js");



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
        // TODO: Load in projects from storage

        if (this.projects.length === 0)
        {
            this.projects = ["New Project"];
        }

        // TODO: Load in todos from storage

        // Load dummy data for now
        this.createTodo("Gimli1", "A dwarf's task 1", new _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate(17, 6, 2023), 2, this.projects[0]);
        this.createTodo("Gimli2", "A dwarf's task 2", new _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate(18, 6, 2023), 3, this.projects[0]);
        this.createTodo("Gimli3", "A dwarf's task 3", new _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate(24, 6, 2023), 4, this.projects[0]);
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
        _dom__WEBPACK_IMPORTED_MODULE_1__["default"].resetTaskProject();
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
    }

    static getAllTodos()
    {
        return this.todos;
    }

    static getAllProjects()
    {
        return this.projects;
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

    static getTodosFromProject(projectName)
    {
        let out = [];
        for (let i = 0; i < this.todos.length; i++)
        {
            if (this.todos[i].project === projectName)
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
                break;
            }
        }
    }

    static removeProject(name)
    {
        for (let i = 0; i < this.projects.length; i++)
        {
            if (this.projects[i] === name)
            {
                this.projects.splice(i, 1);
            }
        }

        if (this.projects.length === 0)
        {
            this.projects.push("New Project");
        }

        let newTodos = [];
        for (let i = 0; i < this.todos.length; i++)
        {
            if (this.todos[i].project !== name)
            {
                newTodos.push(this.todos[i]);
            }
        }
        this.todos = newTodos;
        _dom__WEBPACK_IMPORTED_MODULE_1__["default"].resetTaskProject();
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
/* harmony import */ var _modules_dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/dom.js */ "./src/modules/dom.js");


(function() {
    _modules_dom_js__WEBPACK_IMPORTED_MODULE_0__["default"].loadAllPage();
})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsMEJBQTBCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsNENBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsV0FBVzs7Ozs7O1VDeEwxQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjBDO0FBQzFDO0FBQ0E7QUFDQSxJQUFJLHVEQUFVO0FBQ2QsQ0FBQyxJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9kYXRlTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL25hdi5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3RvZG9zLmpzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ3VzdG9tRGF0ZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihkYXksIG1vbnRoLCB5ZWFyKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGF5ID0gZGF5O1xyXG4gICAgICAgIHRoaXMubW9udGggPSBtb250aDtcclxuICAgICAgICB0aGlzLnllYXIgPSB5ZWFyO1xyXG5cclxuICAgICAgICB0aGlzLndlZWsgPSB0aGlzLmdldFdlZWtGcm9tRGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVGcm9tRGF0ZU9iamVjdChkYXRlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEN1c3RvbURhdGUoZGF0ZS5nZXREYXRlKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXRGdWxsWWVhcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRXZWVrRnJvbURhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKHRoaXMueWVhciwgdGhpcy5tb250aCwgdGhpcy5kYXksIG5ldyBEYXRlKCkuZ2V0SG91cnMoKSwgbmV3IERhdGUoKS5nZXRNaW51dGVzKCkpO1xyXG4gICAgICAgIGxldCBiZWdpbm5pbmdPZlllYXIgPSBuZXcgRGF0ZSh0aGlzLnllYXIsIDAsIDEpO1xyXG4gICAgICAgIGxldCBkYXlzID0gTWF0aC5mbG9vcigoY3VycmVudERhdGUgLSBiZWdpbm5pbmdPZlllYXIpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgd2Vla051bWJlciA9IE1hdGguY2VpbChkYXlzIC8gNyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHdlZWtOdW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3RyaW5nRnJvbURhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBkYXkgPSB0aGlzLmRheS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcclxuICAgICAgICBsZXQgbW9udGggPSAodGhpcy5tb250aCArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpO1xyXG4gICAgICAgIHJldHVybiBgJHtkYXl9LyR7bW9udGh9LyR7dGhpcy55ZWFyfWA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERhdGVNYW5hZ2VyXHJcbntcclxuICAgIHN0YXRpYyBnZXRUb2RheURhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICByZXR1cm4gbmV3IEN1c3RvbURhdGUoZGF0ZS5nZXREYXRlKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXRGdWxsWWVhcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0VG9kYXlXZWVrKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUb2RheURhdGUoKS5nZXRXZWVrRnJvbURhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXJlRGF0ZXNFcXVhbChkYXRlMSwgZGF0ZTIpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFkYXRlMSB8fCAhZGF0ZTIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gZGF0ZTEuZGF5ID09PSBkYXRlMi5kYXkgJiYgXHJcbiAgICAgICAgICAgICAgIGRhdGUxLm1vbnRoID09PSBkYXRlMi5tb250aCAmJiBcclxuICAgICAgICAgICAgICAgZGF0ZTEueWVhciA9PT0gZGF0ZTIueWVhcjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtEYXRlTWFuYWdlciwgQ3VzdG9tRGF0ZX07IiwiaW1wb3J0IERhdGFNYW5hZ2VyIGZyb20gXCIuL3RvZG9zXCI7XHJcbmltcG9ydCBOYXZNYW5hZ2VyIGZyb20gXCIuL25hdlwiO1xyXG5cclxuY2xhc3MgRG9tTWFuYWdlclxyXG57XHJcbiAgICBzdGF0aWMgb3Blbk92ZXJsYXkgPSBudWxsO1xyXG5cclxuICAgIHN0YXRpYyBcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxvYWRET01SZWZlcmVuY2VzKCk7XHJcblxyXG4gICAgICAgIHRoaXMubmF2TWFuYWdlciA9IG5ldyBOYXZNYW5hZ2VyKHRoaXMubWFpbkNvbnRhaW5lciwgdGhpcy5tYWluSGVhZGluZywgdGhpcy50b2RvTGlzdCwgdGhpcy5wcm9qZWN0c0xpc3QpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYXNzaWduRE9NRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRET01SZWZlcmVuY2VzKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRpbW1lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGltbWVyXCIpO1xyXG4gICAgICAgIHRoaXMudGFza0Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Rhc2stZm9ybVwiKTtcclxuICAgICAgICB0aGlzLnByb2plY3RGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9qZWN0LWZvcm1cIik7XHJcblxyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhbGwtYnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RvZGF5LWJ1dHRvblwiKTtcclxuICAgICAgICB0aGlzLndlZWtCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dlZWstYnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFByb2plY3RCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FkZC1wcm9qZWN0LWJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2plY3RzLWxpc3RcIik7XHJcblxyXG4gICAgICAgIHRoaXMubWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1ib2R5LWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYWluSGVhZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1ib2R5LWNvbnRhaW5lciAucGFuZWwtaGVhZGluZ1wiKTtcclxuICAgICAgICB0aGlzLnRvZG9MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RvLWxpc3RcIik7XHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZGQtdGFzay1idXR0b25cIik7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlVGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3JlYXRlLXRhc2std2luZG93XCIpO1xyXG4gICAgICAgIHRoaXMudGFza0RhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Rhc2stZGF0ZVwiKTtcclxuICAgICAgICB0aGlzLnRhc2tQcm9qZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrLXByb2plY3RcIik7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0V2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jcmVhdGUtcHJvamVjdC13aW5kb3dcIik7XHJcblxyXG4gICAgICAgIHRoaXMucmVzZXRUYXNrRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucmVzZXRUYXNrUHJvamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXNldFRhc2tEYXRlKClcclxuICAgIHtcclxuICAgICAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xyXG4gICAgICAgIHRoaXMudGFza0RhdGUubWluID0gdG9kYXk7XHJcbiAgICAgICAgdGhpcy50YXNrRGF0ZS52YWx1ZSA9IHRvZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXNldFRhc2tQcm9qZWN0KClcclxuICAgIHtcclxuICAgICAgICBsZXQgcHJvamVjdHMgPSBEYXRhTWFuYWdlci5nZXRBbGxQcm9qZWN0cygpO1xyXG4gICAgICAgIHRoaXMudGFza1Byb2plY3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBwcm9qZWN0cy5mb3JFYWNoKHByb2plY3QgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRhc2tQcm9qZWN0LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlT3B0aW9uKHByb2plY3QpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRhc2tQcm9qZWN0LmNoaWxkcmVuWzBdLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlT3B0aW9uKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgIG9wdC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIG9wdC50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHJldHVybiBvcHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzc2lnbkRPTUV2ZW50cygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kaW1tZXIub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIERvbU1hbmFnZXIuaGlkZU92ZXJsYXlXaW5kb3coKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRhc2tGb3JtLm9uc3VibWl0ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB0aGlzLnRhc2tGb3JtLnJlcG9ydFZhbGlkaXR5KCk7XHJcbiAgICAgICAgICAgIGlmIChmb3JtVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1WYWx1ZXMgPSBEb21NYW5hZ2VyLmdldEZvcm1WYWx1ZXModGhpcy50YXNrRm9ybSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5jcmVhdGVUb2RvKGZvcm1WYWx1ZXMudGl0bGUsIGZvcm1WYWx1ZXMuZGVzY3JpcHRpb24sIG5ldyBEYXRlKGZvcm1WYWx1ZXMuZGF0ZSksIDAsIGZvcm1WYWx1ZXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFRvZG9zKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVPdmVybGF5V2luZG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnByb2plY3RGb3JtLm9uc3VibWl0ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB0aGlzLnByb2plY3RGb3JtLnJlcG9ydFZhbGlkaXR5KCk7XHJcbiAgICAgICAgICAgIGlmIChmb3JtVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1WYWx1ZXMgPSBEb21NYW5hZ2VyLmdldEZvcm1WYWx1ZXModGhpcy5wcm9qZWN0Rm9ybSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5jcmVhdGVQcm9qZWN0KGZvcm1WYWx1ZXMudGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlT3ZlcmxheVdpbmRvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd092ZXJsYXlXaW5kb3codGhpcy5jcmVhdGVUYXNrV2luZG93KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWRkUHJvamVjdEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dPdmVybGF5V2luZG93KHRoaXMuY3JlYXRlUHJvamVjdFdpbmRvdyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNyZWF0ZVRhc2tXaW5kb3cub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RXaW5kb3cub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hbGxCdXR0b24ub25jbGljayA9ICgpID0+IHt0aGlzLmxvYWRBbGxQYWdlKCl9O1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24ub25jbGljayA9ICgpID0+IHt0aGlzLmxvYWRUb2RheVBhZ2UoKX07XHJcbiAgICAgICAgdGhpcy53ZWVrQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7dGhpcy5sb2FkV2Vla1BhZ2UoKX07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRBbGxQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZEFsbFBhZ2UoKTtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFByb2plY3RzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hbGxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLndlZWtCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuYWRkVGFza0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVG9kYXlQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFRvZGF5UGFnZSgpO1xyXG4gICAgICAgIHRoaXMubmF2TWFuYWdlci5sb2FkUHJvamVjdHMoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFdlZWtQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFdlZWtQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2RheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBcclxuICAgICAgICB0aGlzLmFkZFRhc2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkUHJvamVjdFBhZ2UoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2RheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFRhc2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2hvd092ZXJsYXlXaW5kb3cgPSAod2luZG93Tm9kZSkgPT5cclxuICAgIHtcclxuICAgICAgICB0aGlzLmRpbW1lci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIHdpbmRvd05vZGUuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgICAgIHRoaXMub3Blbk92ZXJsYXkgPSB3aW5kb3dOb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBoaWRlT3ZlcmxheVdpbmRvdyA9ICgpID0+XHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kaW1tZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIGlmICh0aGlzLm9wZW5PdmVybGF5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFza0Zvcm0ucmVzZXQoKTtcclxuICAgICAgICB0aGlzLnByb2plY3RGb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5yZXNldFRhc2tEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldFRhc2tQcm9qZWN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEZvcm1WYWx1ZXMoZm9ybSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG4gICAgICAgIGxldCByZXMgPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmVzW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlTmF2QnV0dG9uKHRleHQpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgIGxpLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgICBsaS5jbGFzc05hbWUgPSBcIm5hdi1idXR0b25cIjtcclxuICAgICAgICByZXR1cm4gbGk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZVRvZG9JdGVtKG5hbWUsIGRhdGUsIHByb2plY3QpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7O1xyXG4gICAgICAgIGxpLmNsYXNzTmFtZSA9IFwidG9kby1pdGVtXCI7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lciA9IGNyZWF0ZVRvZG9CdXR0b25Db250YWluZXIoXCLinJNcIik7XHJcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQodG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9kb05hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRvZG9OYW1lLmNsYXNzTmFtZSA9IFwidG9kby1uYW1lXCI7XHJcbiAgICAgICAgdG9kb05hbWUudGV4dENvbnRlbnQgPSBgJHtuYW1lfSAoJHtwcm9qZWN0fSlgO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9OYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9kb0RhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRvZG9EYXRlLmNsYXNzTmFtZSA9IFwidG9kby1kYXRlXCI7XHJcbiAgICAgICAgdG9kb0RhdGUudGV4dENvbnRlbnQgPSBkYXRlLmdldFN0cmluZ0Zyb21EYXRlKCk7XHJcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQodG9kb0RhdGUpO1xyXG5cclxuICAgICAgICBjb25zdCB0b2RvUmVtb3ZlQnV0dG9uQ29udGFpbmVyID0gY3JlYXRlVG9kb0J1dHRvbkNvbnRhaW5lcihcIlhcIik7XHJcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQodG9kb1JlbW92ZUJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIHJldHVybiB7bGksIHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lciwgdG9kb1JlbW92ZUJ1dHRvbkNvbnRhaW5lcn07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVRvZG9CdXR0b25Db250YWluZXIoYnV0dG9uVGV4dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvZG9CdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICB0b2RvQnV0dG9uQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwidG9kby1idXR0b24tY29udGFpbmVyXCI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgICAgICBidG4uY2xhc3NOYW1lID0gXCJ0b2RvLWJ1dHRvblwiO1xyXG4gICAgICAgICAgICBidG4udGFiSW5kZXggPSAtMTtcclxuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gYnV0dG9uVGV4dDtcclxuICAgICAgICAgICAgdG9kb0J1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChidG4pO1xyXG4gICAgICAgICAgICByZXR1cm4gdG9kb0J1dHRvbkNvbnRhaW5lcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGVuYWJsZUFsbFByaW1hcnlCdXR0b25zKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmFsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLndlZWtCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRG9tTWFuYWdlcjsiLCJpbXBvcnQgRG9tTWFuYWdlciBmcm9tIFwiLi9kb21cIjtcclxuaW1wb3J0IERhdGFNYW5hZ2VyIGZyb20gXCIuL3RvZG9zXCI7XHJcblxyXG5jbGFzcyBOYXZNYW5hZ2VyXHJcbntcclxuICAgIGN1cnJlbnRQYWdlO1xyXG4gICAgY3VycmVudFByb2plY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBoZWFkaW5nLCB0b2RvTGlzdCwgcHJvamVjdExpc3QpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nID0gaGVhZGluZztcclxuICAgICAgICB0aGlzLnRvZG9MaXN0ID0gdG9kb0xpc3Q7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0TGlzdCA9IHByb2plY3RMaXN0O1xyXG5cclxuICAgICAgICB0aGlzLnByb2plY3RCdXR0b25zID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFByb2plY3RzKClcclxuICAgIHtcclxuICAgICAgICBsZXQgcHJvamVjdHMgPSBEYXRhTWFuYWdlci5nZXRBbGxQcm9qZWN0cygpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdExpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0aGlzLnByb2plY3RCdXR0b25zID0gW107XHJcbiAgICAgICAgcHJvamVjdHMuZm9yRWFjaChwcm9qZWN0TmFtZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBidG4gPSBEb21NYW5hZ2VyLmNyZWF0ZU5hdkJ1dHRvbihwcm9qZWN0TmFtZSk7XHJcbiAgICAgICAgICAgIGJ0bi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkUHJvamVjdFBhZ2UocHJvamVjdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0QnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1dHRvbilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IGJ0blJlbW92ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICAgIGJ0blJlbW92ZS5jbGFzc05hbWUgPSBcInByb2plY3QtZGVsZXRlLWJ1dHRvblwiO1xyXG4gICAgICAgICAgICBidG5SZW1vdmUudGV4dENvbnRlbnQgPSBcIlhcIjtcclxuICAgICAgICAgICAgYnRuLmFwcGVuZENoaWxkKGJ0blJlbW92ZSk7XHJcbiAgICAgICAgICAgIGJ0blJlbW92ZS5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoRGF0YU1hbmFnZXIuZ2V0QWxsUHJvamVjdHMoKS5sZW5ndGggPiAxKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLnJlbW92ZVByb2plY3QocHJvamVjdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRvZG9zKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkUHJvamVjdHMoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRBbGxQYWdlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0TGlzdC5hcHBlbmRDaGlsZChidG4pO1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RCdXR0b25zLnB1c2goYnRuKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkVG9kb3MocHJvamVjdE5hbWUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHByb2plY3ROYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UHJvamVjdCA9IHByb2plY3ROYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PT0gXCJBbGxcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QoRGF0YU1hbmFnZXIuZ2V0QWxsVG9kb3MoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT09IFwiVG9kYXlcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QoRGF0YU1hbmFnZXIuZ2V0VG9kb3NGcm9tVG9kYXkoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT09IFwiV2Vla1wiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQW5kQXNzaWduVG9kb3NGcm9tTGlzdChEYXRhTWFuYWdlci5nZXRUb2Rvc0Zyb21UaGlzV2VlaygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5jdXJyZW50UGFnZSA9PT0gXCJQcm9qZWN0XCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KERhdGFNYW5hZ2VyLmdldFRvZG9zRnJvbVByb2plY3QodGhpcy5jdXJyZW50UHJvamVjdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltFUlJPUl06IExvYWRpbmcgdG9kb3MgZm9yIHVua25vd24gcGFnZSFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KHRvZG9zKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudG9kb0xpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB0b2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7bGksIHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lciwgdG9kb1JlbW92ZUJ1dHRvbkNvbnRhaW5lcn0gPSBEb21NYW5hZ2VyLmNyZWF0ZVRvZG9JdGVtKHRvZG8udGl0bGUsIHRvZG8uZHVlRGF0ZSwgdG9kby5wcm9qZWN0KTtcclxuICAgICAgICAgICAgdG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG9MaXN0LnJlbW92ZUNoaWxkKGxpKTtcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLnJlbW92ZVRvZG8odG9kby50aXRsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdG9kb1JlbW92ZUJ1dHRvbkNvbnRhaW5lci5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2RvTGlzdC5yZW1vdmVDaGlsZChsaSk7XHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5yZW1vdmVUb2RvKHRvZG8udGl0bGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudG9kb0xpc3QuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRBbGxQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gXCJBbGxcIjtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBcIkFsbCB0YXNrc1wiO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRUb2RvcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRUb2RheVBhZ2UoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBcIlRvZGF5XCI7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nLnRleHRDb250ZW50ID0gXCJUb2RheSdzIHRhc2tzXCI7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFRvZG9zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFdlZWtQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gXCJXZWVrXCI7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nLnRleHRDb250ZW50ID0gXCJUaGlzIHdlZWsncyB0YXNrc1wiO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRUb2RvcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRQcm9qZWN0UGFnZShuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBcIlByb2plY3RcIjtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBgJHtuYW1lfSdzIHRvZG9zYDtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkVG9kb3MobmFtZSk7XHJcbiAgICAgICAgRG9tTWFuYWdlci5sb2FkUHJvamVjdFBhZ2UoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmF2TWFuYWdlcjsiLCJpbXBvcnQge0RhdGVNYW5hZ2VyLCBDdXN0b21EYXRlfSBmcm9tIFwiLi9kYXRlTWFuYWdlclwiO1xyXG5pbXBvcnQgRG9tTWFuYWdlciBmcm9tIFwiLi9kb21cIjtcclxuXHJcbmNsYXNzIFRvZG8ge1xyXG4gICAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgcHJvamVjdClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XHJcbiAgICAgICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0ZSh2YWwpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kdWVEYXRlID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFByb2plY3QodmFsKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHZhbDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGF0YU1hbmFnZXIge1xyXG4gICAgc3RhdGljIHRvZG9zID0gW107XHJcbiAgICBzdGF0aWMgcHJvamVjdHMgPSBbXTtcclxuXHJcbiAgICBzdGF0aWNcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxvYWREYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWREYXRhKClcclxuICAgIHtcclxuICAgICAgICAvLyBUT0RPOiBMb2FkIGluIHByb2plY3RzIGZyb20gc3RvcmFnZVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcm9qZWN0cy5sZW5ndGggPT09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RzID0gW1wiTmV3IFByb2plY3RcIl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBMb2FkIGluIHRvZG9zIGZyb20gc3RvcmFnZVxyXG5cclxuICAgICAgICAvLyBMb2FkIGR1bW15IGRhdGEgZm9yIG5vd1xyXG4gICAgICAgIHRoaXMuY3JlYXRlVG9kbyhcIkdpbWxpMVwiLCBcIkEgZHdhcmYncyB0YXNrIDFcIiwgbmV3IEN1c3RvbURhdGUoMTcsIDYsIDIwMjMpLCAyLCB0aGlzLnByb2plY3RzWzBdKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVRvZG8oXCJHaW1saTJcIiwgXCJBIGR3YXJmJ3MgdGFzayAyXCIsIG5ldyBDdXN0b21EYXRlKDE4LCA2LCAyMDIzKSwgMywgdGhpcy5wcm9qZWN0c1swXSk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVUb2RvKFwiR2ltbGkzXCIsIFwiQSBkd2FyZidzIHRhc2sgM1wiLCBuZXcgQ3VzdG9tRGF0ZSgyNCwgNiwgMjAyMyksIDQsIHRoaXMucHJvamVjdHNbMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVQcm9qZWN0KG5hbWUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0cy5pbmNsdWRlcyhuYW1lKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQcm9qZWN0IGFscmVhZHkgZXhpc3RzIVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdHMucHVzaChuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhbGVydChcIkludmFsaWQgcHJvamVjdCBuYW1lIVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgRG9tTWFuYWdlci5yZXNldFRhc2tQcm9qZWN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZVRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgcHJvamVjdClcclxuICAgIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS50aXRsZSA9PT0gdGl0bGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGFzayBuYW1lIG11c3QgYmUgdW5pcXVlIVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEoZHVlRGF0ZSBpbnN0YW5jZW9mIEN1c3RvbURhdGUpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZHVlRGF0ZSA9IEN1c3RvbURhdGUuY3JlYXRlRnJvbURhdGVPYmplY3QoZHVlRGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdG9kbyA9IG5ldyBUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHByb2plY3QpO1xyXG4gICAgICAgIHRoaXMudG9kb3MucHVzaCh0b2RvKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0QWxsVG9kb3MoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvZG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRBbGxQcm9qZWN0cygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdHM7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFRvZG9zRnJvbVRvZGF5KClcclxuICAgIHtcclxuICAgICAgICBsZXQgdG9kYXkgPSBEYXRlTWFuYWdlci5nZXRUb2RheURhdGUoKTtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChEYXRlTWFuYWdlci5hcmVEYXRlc0VxdWFsKHRvZGF5LCB0aGlzLnRvZG9zW2ldLmR1ZURhdGUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIG91dC5wdXNoKHRoaXMudG9kb3NbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFRvZG9zRnJvbVRoaXNXZWVrKClcclxuICAgIHtcclxuICAgICAgICBsZXQgdG9kYXlXZWVrID0gRGF0ZU1hbmFnZXIuZ2V0VG9kYXlXZWVrKCk7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS5kdWVEYXRlLndlZWsgPT09IHRvZGF5V2VlaylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb3V0LnB1c2godGhpcy50b2Rvc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0VG9kb3NGcm9tUHJvamVjdChwcm9qZWN0TmFtZSlcclxuICAgIHtcclxuICAgICAgICBsZXQgb3V0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9kb3NbaV0ucHJvamVjdCA9PT0gcHJvamVjdE5hbWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG91dC5wdXNoKHRoaXMudG9kb3NbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlbW92ZVRvZG8obmFtZSlcclxuICAgIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS50aXRsZSA9PT0gbmFtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVtb3ZlUHJvamVjdChuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9qZWN0cy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RzW2ldID09PSBuYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJvamVjdHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0cy5wdXNoKFwiTmV3IFByb2plY3RcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbmV3VG9kb3MgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS5wcm9qZWN0ICE9PSBuYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuZXdUb2Rvcy5wdXNoKHRoaXMudG9kb3NbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudG9kb3MgPSBuZXdUb2RvcztcclxuICAgICAgICBEb21NYW5hZ2VyLnJlc2V0VGFza1Byb2plY3QoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0YU1hbmFnZXI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgRG9tTWFuYWdlciBmcm9tICcuL21vZHVsZXMvZG9tLmpzJztcclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgIERvbU1hbmFnZXIubG9hZEFsbFBhZ2UoKTtcclxufSkoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=