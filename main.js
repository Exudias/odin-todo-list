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
        
                _todos__WEBPACK_IMPORTED_MODULE_0__["default"].createTodo(formValues.title, formValues.description, new Date(formValues.date), formValues.priority, formValues.project);
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

        return {li, todoCompleteButtonContainer};

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
        let sorted = todos.sort((a, b) => a.priority > b.priority ? -1 : 1);
        todos.forEach(todo => {
            const {li, todoCompleteButtonContainer} = _dom__WEBPACK_IMPORTED_MODULE_0__["default"].createTodoItem(todo.title, todo.dueDate, todo.project);
            todoCompleteButtonContainer.onclick = () => {
                this.todoList.removeChild(li);
                _todos__WEBPACK_IMPORTED_MODULE_1__["default"].removeTodo(todo.title);
            }
            let priorityClass = todo.priority === "0" ? "green" : (todo.priority === "1" ? "orange" : "red");
            todoCompleteButtonContainer.children[0].classList.add(priorityClass);

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
        this.createTodo("Gimli1", "A dwarf's task 1", new _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate(17, 6, 2023), "1", this.projects[0]);
        this.createTodo("Gimli2", "A dwarf's task 2", new _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate(18, 6, 2023), "2", this.projects[0]);
        this.createTodo("Gimli3", "A dwarf's task 3", new _dateManager__WEBPACK_IMPORTED_MODULE_0__.CustomDate(24, 6, 2023), "0", this.projects[0]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLDRDQUFVO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLGlFQUFlLFdBQVc7Ozs7OztVQ3hMMUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ04wQztBQUMxQztBQUNBO0FBQ0EsSUFBSSx1REFBVTtBQUNkLENBQUMsSSIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4tdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvZGF0ZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9kb20uanMiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9uYXYuanMiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy90b2Rvcy5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29kaW4tdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEN1c3RvbURhdGVcclxue1xyXG4gICAgY29uc3RydWN0b3IoZGF5LCBtb250aCwgeWVhcilcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRheSA9IGRheTtcclxuICAgICAgICB0aGlzLm1vbnRoID0gbW9udGg7XHJcbiAgICAgICAgdGhpcy55ZWFyID0geWVhcjtcclxuXHJcbiAgICAgICAgdGhpcy53ZWVrID0gdGhpcy5nZXRXZWVrRnJvbURhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlRnJvbURhdGVPYmplY3QoZGF0ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAoIWRhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDdXN0b21EYXRlKGRhdGUuZ2V0RGF0ZSgpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RnVsbFllYXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0V2Vla0Zyb21EYXRlKClcclxuICAgIHtcclxuICAgICAgICBsZXQgY3VycmVudERhdGUgPSBuZXcgRGF0ZSh0aGlzLnllYXIsIHRoaXMubW9udGgsIHRoaXMuZGF5LCBuZXcgRGF0ZSgpLmdldEhvdXJzKCksIG5ldyBEYXRlKCkuZ2V0TWludXRlcygpKTtcclxuICAgICAgICBsZXQgYmVnaW5uaW5nT2ZZZWFyID0gbmV3IERhdGUodGhpcy55ZWFyLCAwLCAxKTtcclxuICAgICAgICBsZXQgZGF5cyA9IE1hdGguZmxvb3IoKGN1cnJlbnREYXRlIC0gYmVnaW5uaW5nT2ZZZWFyKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHdlZWtOdW1iZXIgPSBNYXRoLmNlaWwoZGF5cyAvIDcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB3ZWVrTnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFN0cmluZ0Zyb21EYXRlKClcclxuICAgIHtcclxuICAgICAgICBsZXQgZGF5ID0gdGhpcy5kYXkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XHJcbiAgICAgICAgbGV0IG1vbnRoID0gKHRoaXMubW9udGggKyAxKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcclxuICAgICAgICByZXR1cm4gYCR7ZGF5fS8ke21vbnRofS8ke3RoaXMueWVhcn1gO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBEYXRlTWFuYWdlclxyXG57XHJcbiAgICBzdGF0aWMgZ2V0VG9kYXlEYXRlKClcclxuICAgIHtcclxuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDdXN0b21EYXRlKGRhdGUuZ2V0RGF0ZSgpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RnVsbFllYXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFRvZGF5V2VlaygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9kYXlEYXRlKCkuZ2V0V2Vla0Zyb21EYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFyZURhdGVzRXF1YWwoZGF0ZTEsIGRhdGUyKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZGF0ZTEgfHwgIWRhdGUyKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIGRhdGUxLmRheSA9PT0gZGF0ZTIuZGF5ICYmIFxyXG4gICAgICAgICAgICAgICBkYXRlMS5tb250aCA9PT0gZGF0ZTIubW9udGggJiYgXHJcbiAgICAgICAgICAgICAgIGRhdGUxLnllYXIgPT09IGRhdGUyLnllYXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7RGF0ZU1hbmFnZXIsIEN1c3RvbURhdGV9OyIsImltcG9ydCBEYXRhTWFuYWdlciBmcm9tIFwiLi90b2Rvc1wiO1xyXG5pbXBvcnQgTmF2TWFuYWdlciBmcm9tIFwiLi9uYXZcIjtcclxuXHJcbmNsYXNzIERvbU1hbmFnZXJcclxue1xyXG4gICAgc3RhdGljIG9wZW5PdmVybGF5ID0gbnVsbDtcclxuXHJcbiAgICBzdGF0aWMgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5sb2FkRE9NUmVmZXJlbmNlcygpO1xyXG5cclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIgPSBuZXcgTmF2TWFuYWdlcih0aGlzLm1haW5Db250YWluZXIsIHRoaXMubWFpbkhlYWRpbmcsIHRoaXMudG9kb0xpc3QsIHRoaXMucHJvamVjdHNMaXN0KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFzc2lnbkRPTUV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkRE9NUmVmZXJlbmNlcygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kaW1tZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpbW1lclwiKTtcclxuICAgICAgICB0aGlzLnRhc2tGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrLWZvcm1cIik7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvamVjdC1mb3JtXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmFsbEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWxsLWJ1dHRvblwiKTtcclxuICAgICAgICB0aGlzLnRvZGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0b2RheS1idXR0b25cIik7XHJcbiAgICAgICAgdGhpcy53ZWVrQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3ZWVrLWJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRQcm9qZWN0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZGQtcHJvamVjdC1idXR0b25cIik7XHJcblxyXG4gICAgICAgIHRoaXMucHJvamVjdHNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcm9qZWN0cy1saXN0XCIpO1xyXG5cclxuICAgICAgICB0aGlzLm1haW5Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1haW4tYm9keS1jb250YWluZXJcIik7XHJcblxyXG4gICAgICAgIHRoaXMubWFpbkhlYWRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1haW4tYm9keS1jb250YWluZXIgLnBhbmVsLWhlYWRpbmdcIik7XHJcbiAgICAgICAgdGhpcy50b2RvTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG9kby1saXN0XCIpO1xyXG4gICAgICAgIHRoaXMuYWRkVGFza0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWRkLXRhc2stYnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVRhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNyZWF0ZS10YXNrLXdpbmRvd1wiKTtcclxuICAgICAgICB0aGlzLnRhc2tEYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrLWRhdGVcIik7XHJcbiAgICAgICAgdGhpcy50YXNrUHJvamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGFzay1wcm9qZWN0XCIpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdFdpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3JlYXRlLXByb2plY3Qtd2luZG93XCIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlc2V0VGFza0RhdGUoKTtcclxuICAgICAgICB0aGlzLnJlc2V0VGFza1Byb2plY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVzZXRUYXNrRGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcclxuICAgICAgICB0aGlzLnRhc2tEYXRlLm1pbiA9IHRvZGF5O1xyXG4gICAgICAgIHRoaXMudGFza0RhdGUudmFsdWUgPSB0b2RheTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVzZXRUYXNrUHJvamVjdCgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHByb2plY3RzID0gRGF0YU1hbmFnZXIuZ2V0QWxsUHJvamVjdHMoKTtcclxuICAgICAgICB0aGlzLnRhc2tQcm9qZWN0LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgcHJvamVjdHMuZm9yRWFjaChwcm9qZWN0ID0+IHtcclxuICAgICAgICAgICAgdGhpcy50YXNrUHJvamVjdC5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZU9wdGlvbihwcm9qZWN0KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50YXNrUHJvamVjdC5jaGlsZHJlblswXS5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZU9wdGlvbih2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICBsZXQgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBvcHQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBvcHQudGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICByZXR1cm4gb3B0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3NpZ25ET01FdmVudHMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGltbWVyLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBEb21NYW5hZ2VyLmhpZGVPdmVybGF5V2luZG93KCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy50YXNrRm9ybS5vbnN1Ym1pdCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc3QgZm9ybVZhbGlkID0gdGhpcy50YXNrRm9ybS5yZXBvcnRWYWxpZGl0eSgpO1xyXG4gICAgICAgICAgICBpZiAoZm9ybVZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtVmFsdWVzID0gRG9tTWFuYWdlci5nZXRGb3JtVmFsdWVzKHRoaXMudGFza0Zvcm0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuY3JlYXRlVG9kbyhmb3JtVmFsdWVzLnRpdGxlLCBmb3JtVmFsdWVzLmRlc2NyaXB0aW9uLCBuZXcgRGF0ZShmb3JtVmFsdWVzLmRhdGUpLCBmb3JtVmFsdWVzLnByaW9yaXR5LCBmb3JtVmFsdWVzLnByb2plY3QpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRUb2RvcygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlT3ZlcmxheVdpbmRvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0Rm9ybS5vbnN1Ym1pdCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc3QgZm9ybVZhbGlkID0gdGhpcy5wcm9qZWN0Rm9ybS5yZXBvcnRWYWxpZGl0eSgpO1xyXG4gICAgICAgICAgICBpZiAoZm9ybVZhbGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtVmFsdWVzID0gRG9tTWFuYWdlci5nZXRGb3JtVmFsdWVzKHRoaXMucHJvamVjdEZvcm0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuY3JlYXRlUHJvamVjdChmb3JtVmFsdWVzLnRpdGxlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubmF2TWFuYWdlci5sb2FkUHJvamVjdHMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZU92ZXJsYXlXaW5kb3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYWRkVGFza0J1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dPdmVybGF5V2luZG93KHRoaXMuY3JlYXRlVGFza1dpbmRvdyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFkZFByb2plY3RCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zaG93T3ZlcmxheVdpbmRvdyh0aGlzLmNyZWF0ZVByb2plY3RXaW5kb3cpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jcmVhdGVUYXNrV2luZG93Lm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0V2luZG93Lm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7dGhpcy5sb2FkQWxsUGFnZSgpfTtcclxuICAgICAgICB0aGlzLnRvZGF5QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7dGhpcy5sb2FkVG9kYXlQYWdlKCl9O1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5vbmNsaWNrID0gKCkgPT4ge3RoaXMubG9hZFdlZWtQYWdlKCl9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkQWxsUGFnZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRBbGxQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRvZGF5QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy53ZWVrQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICBcclxuICAgICAgICB0aGlzLmFkZFRhc2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFRvZGF5UGFnZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRUb2RheVBhZ2UoKTtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFByb2plY3RzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hbGxCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnRvZGF5QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLndlZWtCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuYWRkVGFza0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRXZWVrUGFnZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRXZWVrUGFnZSgpO1xyXG4gICAgICAgIHRoaXMubmF2TWFuYWdlci5sb2FkUHJvamVjdHMoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLndlZWtCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFByb2plY3RQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmFsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLndlZWtCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNob3dPdmVybGF5V2luZG93ID0gKHdpbmRvd05vZGUpID0+XHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kaW1tZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICB3aW5kb3dOb2RlLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgICAgICB0aGlzLm9wZW5PdmVybGF5ID0gd2luZG93Tm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaGlkZU92ZXJsYXlXaW5kb3cgPSAoKSA9PlxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGltbWVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICBpZiAodGhpcy5vcGVuT3ZlcmxheSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMub3Blbk92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRhc2tGb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0Rm9ybS5yZXNldCgpO1xyXG4gICAgICAgIHRoaXMucmVzZXRUYXNrRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucmVzZXRUYXNrUHJvamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRGb3JtVmFsdWVzKGZvcm0pXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcclxuICAgICAgICBsZXQgcmVzID0ge307XHJcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc1trZXldID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZU5hdkJ1dHRvbih0ZXh0KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICBsaS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgbGkuY2xhc3NOYW1lID0gXCJuYXYtYnV0dG9uXCI7XHJcbiAgICAgICAgcmV0dXJuIGxpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVUb2RvSXRlbShuYW1lLCBkYXRlLCBwcm9qZWN0KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpOztcclxuICAgICAgICBsaS5jbGFzc05hbWUgPSBcInRvZG8taXRlbVwiO1xyXG5cclxuICAgICAgICBjb25zdCB0b2RvQ29tcGxldGVCdXR0b25Db250YWluZXIgPSBjcmVhdGVUb2RvQnV0dG9uQ29udGFpbmVyKFwi4pyTXCIpO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9OYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0b2RvTmFtZS5jbGFzc05hbWUgPSBcInRvZG8tbmFtZVwiO1xyXG4gICAgICAgIHRvZG9OYW1lLnRleHRDb250ZW50ID0gYCR7bmFtZX0gKCR7cHJvamVjdH0pYDtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZCh0b2RvTmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9EYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0b2RvRGF0ZS5jbGFzc05hbWUgPSBcInRvZG8tZGF0ZVwiO1xyXG4gICAgICAgIHRvZG9EYXRlLnRleHRDb250ZW50ID0gZGF0ZS5nZXRTdHJpbmdGcm9tRGF0ZSgpO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9EYXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtsaSwgdG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlVG9kb0J1dHRvbkNvbnRhaW5lcihidXR0b25UZXh0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgdG9kb0J1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHRvZG9CdXR0b25Db250YWluZXIuY2xhc3NOYW1lID0gXCJ0b2RvLWJ1dHRvbi1jb250YWluZXJcIjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICAgIGJ0bi5jbGFzc05hbWUgPSBcInRvZG8tYnV0dG9uXCI7XHJcbiAgICAgICAgICAgIGJ0bi50YWJJbmRleCA9IC0xO1xyXG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBidXR0b25UZXh0O1xyXG4gICAgICAgICAgICB0b2RvQnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ0bik7XHJcbiAgICAgICAgICAgIHJldHVybiB0b2RvQnV0dG9uQ29udGFpbmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5hYmxlQWxsUHJpbWFyeUJ1dHRvbnMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2RheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEb21NYW5hZ2VyOyIsImltcG9ydCBEb21NYW5hZ2VyIGZyb20gXCIuL2RvbVwiO1xyXG5pbXBvcnQgRGF0YU1hbmFnZXIgZnJvbSBcIi4vdG9kb3NcIjtcclxuXHJcbmNsYXNzIE5hdk1hbmFnZXJcclxue1xyXG4gICAgY3VycmVudFBhZ2U7XHJcbiAgICBjdXJyZW50UHJvamVjdDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGhlYWRpbmcsIHRvZG9MaXN0LCBwcm9qZWN0TGlzdClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmhlYWRpbmcgPSBoZWFkaW5nO1xyXG4gICAgICAgIHRoaXMudG9kb0xpc3QgPSB0b2RvTGlzdDtcclxuICAgICAgICB0aGlzLnByb2plY3RMaXN0ID0gcHJvamVjdExpc3Q7XHJcblxyXG4gICAgICAgIHRoaXMucHJvamVjdEJ1dHRvbnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUHJvamVjdHMoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBwcm9qZWN0cyA9IERhdGFNYW5hZ2VyLmdldEFsbFByb2plY3RzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0TGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMucHJvamVjdEJ1dHRvbnMgPSBbXTtcclxuICAgICAgICBwcm9qZWN0cy5mb3JFYWNoKHByb2plY3ROYW1lID0+IHtcclxuICAgICAgICAgICAgbGV0IGJ0biA9IERvbU1hbmFnZXIuY3JlYXRlTmF2QnV0dG9uKHByb2plY3ROYW1lKTtcclxuICAgICAgICAgICAgYnRuLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRQcm9qZWN0UGFnZShwcm9qZWN0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgYnRuUmVtb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICAgICAgYnRuUmVtb3ZlLmNsYXNzTmFtZSA9IFwicHJvamVjdC1kZWxldGUtYnV0dG9uXCI7XHJcbiAgICAgICAgICAgIGJ0blJlbW92ZS50ZXh0Q29udGVudCA9IFwiWFwiO1xyXG4gICAgICAgICAgICBidG4uYXBwZW5kQ2hpbGQoYnRuUmVtb3ZlKTtcclxuICAgICAgICAgICAgYnRuUmVtb3ZlLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5nZXRBbGxQcm9qZWN0cygpLmxlbmd0aCA+IDEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIucmVtb3ZlUHJvamVjdChwcm9qZWN0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVG9kb3MoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZEFsbFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RMaXN0LmFwcGVuZENoaWxkKGJ0bik7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdEJ1dHRvbnMucHVzaChidG4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRUb2Rvcyhwcm9qZWN0TmFtZSlcclxuICAgIHtcclxuICAgICAgICBpZiAocHJvamVjdE5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdE5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09PSBcIkFsbFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQW5kQXNzaWduVG9kb3NGcm9tTGlzdChEYXRhTWFuYWdlci5nZXRBbGxUb2RvcygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5jdXJyZW50UGFnZSA9PT0gXCJUb2RheVwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQW5kQXNzaWduVG9kb3NGcm9tTGlzdChEYXRhTWFuYWdlci5nZXRUb2Rvc0Zyb21Ub2RheSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5jdXJyZW50UGFnZSA9PT0gXCJXZWVrXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KERhdGFNYW5hZ2VyLmdldFRvZG9zRnJvbVRoaXNXZWVrKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmN1cnJlbnRQYWdlID09PSBcIlByb2plY3RcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QoRGF0YU1hbmFnZXIuZ2V0VG9kb3NGcm9tUHJvamVjdCh0aGlzLmN1cnJlbnRQcm9qZWN0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0VSUk9SXTogTG9hZGluZyB0b2RvcyBmb3IgdW5rbm93biBwYWdlIVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QodG9kb3MpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50b2RvTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGxldCBzb3J0ZWQgPSB0b2Rvcy5zb3J0KChhLCBiKSA9PiBhLnByaW9yaXR5ID4gYi5wcmlvcml0eSA/IC0xIDogMSk7XHJcbiAgICAgICAgdG9kb3MuZm9yRWFjaCh0b2RvID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge2xpLCB0b2RvQ29tcGxldGVCdXR0b25Db250YWluZXJ9ID0gRG9tTWFuYWdlci5jcmVhdGVUb2RvSXRlbSh0b2RvLnRpdGxlLCB0b2RvLmR1ZURhdGUsIHRvZG8ucHJvamVjdCk7XHJcbiAgICAgICAgICAgIHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lci5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2RvTGlzdC5yZW1vdmVDaGlsZChsaSk7XHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5yZW1vdmVUb2RvKHRvZG8udGl0bGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwcmlvcml0eUNsYXNzID0gdG9kby5wcmlvcml0eSA9PT0gXCIwXCIgPyBcImdyZWVuXCIgOiAodG9kby5wcmlvcml0eSA9PT0gXCIxXCIgPyBcIm9yYW5nZVwiIDogXCJyZWRcIik7XHJcbiAgICAgICAgICAgIHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lci5jaGlsZHJlblswXS5jbGFzc0xpc3QuYWRkKHByaW9yaXR5Q2xhc3MpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50b2RvTGlzdC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEFsbFBhZ2UoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBcIkFsbFwiO1xyXG4gICAgICAgIHRoaXMuaGVhZGluZy50ZXh0Q29udGVudCA9IFwiQWxsIHRhc2tzXCI7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFRvZG9zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFRvZGF5UGFnZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IFwiVG9kYXlcIjtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBcIlRvZGF5J3MgdGFza3NcIjtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkVG9kb3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkV2Vla1BhZ2UoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBcIldlZWtcIjtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBcIlRoaXMgd2VlaydzIHRhc2tzXCI7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFRvZG9zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFByb2plY3RQYWdlKG5hbWUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IFwiUHJvamVjdFwiO1xyXG4gICAgICAgIHRoaXMuaGVhZGluZy50ZXh0Q29udGVudCA9IGAke25hbWV9J3MgdG9kb3NgO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRUb2RvcyhuYW1lKTtcclxuICAgICAgICBEb21NYW5hZ2VyLmxvYWRQcm9qZWN0UGFnZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBOYXZNYW5hZ2VyOyIsImltcG9ydCB7RGF0ZU1hbmFnZXIsIEN1c3RvbURhdGV9IGZyb20gXCIuL2RhdGVNYW5hZ2VyXCI7XHJcbmltcG9ydCBEb21NYW5hZ2VyIGZyb20gXCIuL2RvbVwiO1xyXG5cclxuY2xhc3MgVG9kbyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICAgICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTtcclxuICAgICAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRlKHZhbClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmR1ZURhdGUgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJvamVjdCh2YWwpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gdmFsO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBEYXRhTWFuYWdlciB7XHJcbiAgICBzdGF0aWMgdG9kb3MgPSBbXTtcclxuICAgIHN0YXRpYyBwcm9qZWN0cyA9IFtdO1xyXG5cclxuICAgIHN0YXRpY1xyXG4gICAge1xyXG4gICAgICAgIHRoaXMubG9hZERhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZERhdGEoKVxyXG4gICAge1xyXG4gICAgICAgIC8vIFRPRE86IExvYWQgaW4gcHJvamVjdHMgZnJvbSBzdG9yYWdlXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByb2plY3RzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdHMgPSBbXCJOZXcgUHJvamVjdFwiXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IExvYWQgaW4gdG9kb3MgZnJvbSBzdG9yYWdlXHJcblxyXG4gICAgICAgIC8vIExvYWQgZHVtbXkgZGF0YSBmb3Igbm93XHJcbiAgICAgICAgdGhpcy5jcmVhdGVUb2RvKFwiR2ltbGkxXCIsIFwiQSBkd2FyZidzIHRhc2sgMVwiLCBuZXcgQ3VzdG9tRGF0ZSgxNywgNiwgMjAyMyksIFwiMVwiLCB0aGlzLnByb2plY3RzWzBdKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVRvZG8oXCJHaW1saTJcIiwgXCJBIGR3YXJmJ3MgdGFzayAyXCIsIG5ldyBDdXN0b21EYXRlKDE4LCA2LCAyMDIzKSwgXCIyXCIsIHRoaXMucHJvamVjdHNbMF0pO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlVG9kbyhcIkdpbWxpM1wiLCBcIkEgZHdhcmYncyB0YXNrIDNcIiwgbmV3IEN1c3RvbURhdGUoMjQsIDYsIDIwMjMpLCBcIjBcIiwgdGhpcy5wcm9qZWN0c1swXSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZVByb2plY3QobmFtZSlcclxuICAgIHtcclxuICAgICAgICBpZiAobmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RzLmluY2x1ZGVzKG5hbWUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlByb2plY3QgYWxyZWFkeSBleGlzdHMhXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0cy5wdXNoKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiSW52YWxpZCBwcm9qZWN0IG5hbWUhXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBEb21NYW5hZ2VyLnJlc2V0VGFza1Byb2plY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0KVxyXG4gICAge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZG9zW2ldLnRpdGxlID09PSB0aXRsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJUYXNrIG5hbWUgbXVzdCBiZSB1bmlxdWUhXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIShkdWVEYXRlIGluc3RhbmNlb2YgQ3VzdG9tRGF0ZSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkdWVEYXRlID0gQ3VzdG9tRGF0ZS5jcmVhdGVGcm9tRGF0ZU9iamVjdChkdWVEYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0b2RvID0gbmV3IFRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgcHJvamVjdCk7XHJcbiAgICAgICAgdGhpcy50b2Rvcy5wdXNoKHRvZG8pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRBbGxUb2RvcygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9kb3M7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEFsbFByb2plY3RzKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0cztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0VG9kb3NGcm9tVG9kYXkoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCB0b2RheSA9IERhdGVNYW5hZ2VyLmdldFRvZGF5RGF0ZSgpO1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKERhdGVNYW5hZ2VyLmFyZURhdGVzRXF1YWwodG9kYXksIHRoaXMudG9kb3NbaV0uZHVlRGF0ZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgb3V0LnB1c2godGhpcy50b2Rvc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0VG9kb3NGcm9tVGhpc1dlZWsoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCB0b2RheVdlZWsgPSBEYXRlTWFuYWdlci5nZXRUb2RheVdlZWsoKTtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZG9zW2ldLmR1ZURhdGUud2VlayA9PT0gdG9kYXlXZWVrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQucHVzaCh0aGlzLnRvZG9zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2Rvc0Zyb21Qcm9qZWN0KHByb2plY3ROYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBvdXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS5wcm9qZWN0ID09PSBwcm9qZWN0TmFtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb3V0LnB1c2godGhpcy50b2Rvc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVtb3ZlVG9kbyhuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZG9zW2ldLnRpdGxlID09PSBuYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG9zLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZW1vdmVQcm9qZWN0KG5hbWUpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb2plY3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdHNbaV0gPT09IG5hbWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcm9qZWN0cy5sZW5ndGggPT09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RzLnB1c2goXCJOZXcgUHJvamVjdFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBuZXdUb2RvcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZG9zW2ldLnByb2plY3QgIT09IG5hbWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5ld1RvZG9zLnB1c2godGhpcy50b2Rvc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50b2RvcyA9IG5ld1RvZG9zO1xyXG4gICAgICAgIERvbU1hbmFnZXIucmVzZXRUYXNrUHJvamVjdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXRhTWFuYWdlcjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBEb21NYW5hZ2VyIGZyb20gJy4vbW9kdWxlcy9kb20uanMnO1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgRG9tTWFuYWdlci5sb2FkQWxsUGFnZSgpO1xyXG59KSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==