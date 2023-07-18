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

    static getStringFromDate(date)
    {
        let day = date.day.toString().padStart(2, "0");
        let month = (date.month + 1).toString().padStart(2, "0");
        return `${day}/${month}/${date.year}`;
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
/* harmony import */ var _dateManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dateManager */ "./src/modules/dateManager.js");




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

    static createTodoItem(name, description, date, project)
    {
        const li = document.createElement("li");;
        li.className = "todo-item";

        const todoCompleteButtonContainer = createTodoButtonContainer("✓");
        li.appendChild(todoCompleteButtonContainer);

        const todoName = document.createElement("div");
        todoName.className = "todo-name";
        todoName.title = description;
        todoName.textContent = `${name} (${project})`;
        li.appendChild(todoName);

        const todoDate = document.createElement("div");
        todoDate.className = "todo-date";
        todoDate.textContent = _dateManager__WEBPACK_IMPORTED_MODULE_2__.CustomDate.getStringFromDate(date);
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
        if (!todos || todos.length === 0)
        {
            return;
        }
        let sorted = todos.sort((a, b) => a.priority > b.priority ? -1 : 1);
        sorted.forEach(todo => {
            const {li, todoCompleteButtonContainer} = _dom__WEBPACK_IMPORTED_MODULE_0__["default"].createTodoItem(todo.title, todo.description, todo.dueDate, todo.project);
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
        this.projects = JSON.parse(window.localStorage.getItem("projects"));

        if (!this.projects || this.projects.length === 0)
        {
            this.projects = ["New Project"];
            window.localStorage.setItem("projects", JSON.stringify(this.projects));
        }

        this.todos = JSON.parse(window.localStorage.getItem("todos"));
        if (!this.todos)
        {
            this.todos = [];
        }

        console.log(this.projects);
        console.log(this.todos);
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
                window.localStorage.setItem("projects", JSON.stringify(this.projects));
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
        window.localStorage.setItem("todos", JSON.stringify(this.todos));
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
            window.localStorage.setItem("projects", JSON.stringify(this.projects));
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
        window.localStorage.setItem("todos", JSON.stringify(this.todos));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsNENBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsV0FBVzs7Ozs7O1VDL0wxQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjBDO0FBQzFDO0FBQ0E7QUFDQSxJQUFJLHVEQUFVO0FBQ2QsQ0FBQyxJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9kYXRlTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL25hdi5qcyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3RvZG9zLmpzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ3VzdG9tRGF0ZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihkYXksIG1vbnRoLCB5ZWFyKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGF5ID0gZGF5O1xyXG4gICAgICAgIHRoaXMubW9udGggPSBtb250aDtcclxuICAgICAgICB0aGlzLnllYXIgPSB5ZWFyO1xyXG5cclxuICAgICAgICB0aGlzLndlZWsgPSB0aGlzLmdldFdlZWtGcm9tRGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVGcm9tRGF0ZU9iamVjdChkYXRlKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEN1c3RvbURhdGUoZGF0ZS5nZXREYXRlKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXRGdWxsWWVhcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRXZWVrRnJvbURhdGUoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKHRoaXMueWVhciwgdGhpcy5tb250aCwgdGhpcy5kYXksIG5ldyBEYXRlKCkuZ2V0SG91cnMoKSwgbmV3IERhdGUoKS5nZXRNaW51dGVzKCkpO1xyXG4gICAgICAgIGxldCBiZWdpbm5pbmdPZlllYXIgPSBuZXcgRGF0ZSh0aGlzLnllYXIsIDAsIDEpO1xyXG4gICAgICAgIGxldCBkYXlzID0gTWF0aC5mbG9vcigoY3VycmVudERhdGUgLSBiZWdpbm5pbmdPZlllYXIpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgd2Vla051bWJlciA9IE1hdGguY2VpbChkYXlzIC8gNyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHdlZWtOdW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFN0cmluZ0Zyb21EYXRlKGRhdGUpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGRheSA9IGRhdGUuZGF5LnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpO1xyXG4gICAgICAgIGxldCBtb250aCA9IChkYXRlLm1vbnRoICsgMSkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XHJcbiAgICAgICAgcmV0dXJuIGAke2RheX0vJHttb250aH0vJHtkYXRlLnllYXJ9YDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGF0ZU1hbmFnZXJcclxue1xyXG4gICAgc3RhdGljIGdldFRvZGF5RGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiBuZXcgQ3VzdG9tRGF0ZShkYXRlLmdldERhdGUoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldEZ1bGxZZWFyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2RheVdlZWsoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRvZGF5RGF0ZSgpLmdldFdlZWtGcm9tRGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhcmVEYXRlc0VxdWFsKGRhdGUxLCBkYXRlMilcclxuICAgIHtcclxuICAgICAgICBpZiAoIWRhdGUxIHx8ICFkYXRlMikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBkYXRlMS5kYXkgPT09IGRhdGUyLmRheSAmJiBcclxuICAgICAgICAgICAgICAgZGF0ZTEubW9udGggPT09IGRhdGUyLm1vbnRoICYmIFxyXG4gICAgICAgICAgICAgICBkYXRlMS55ZWFyID09PSBkYXRlMi55ZWFyO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0RhdGVNYW5hZ2VyLCBDdXN0b21EYXRlfTsiLCJpbXBvcnQgRGF0YU1hbmFnZXIgZnJvbSBcIi4vdG9kb3NcIjtcclxuaW1wb3J0IE5hdk1hbmFnZXIgZnJvbSBcIi4vbmF2XCI7XHJcbmltcG9ydCB7IEN1c3RvbURhdGUgfSBmcm9tIFwiLi9kYXRlTWFuYWdlclwiO1xyXG5cclxuY2xhc3MgRG9tTWFuYWdlclxyXG57XHJcbiAgICBzdGF0aWMgb3Blbk92ZXJsYXkgPSBudWxsO1xyXG5cclxuICAgIHN0YXRpYyBcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxvYWRET01SZWZlcmVuY2VzKCk7XHJcblxyXG4gICAgICAgIHRoaXMubmF2TWFuYWdlciA9IG5ldyBOYXZNYW5hZ2VyKHRoaXMubWFpbkNvbnRhaW5lciwgdGhpcy5tYWluSGVhZGluZywgdGhpcy50b2RvTGlzdCwgdGhpcy5wcm9qZWN0c0xpc3QpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYXNzaWduRE9NRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRET01SZWZlcmVuY2VzKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRpbW1lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGltbWVyXCIpO1xyXG4gICAgICAgIHRoaXMudGFza0Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Rhc2stZm9ybVwiKTtcclxuICAgICAgICB0aGlzLnByb2plY3RGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9qZWN0LWZvcm1cIik7XHJcblxyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhbGwtYnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RvZGF5LWJ1dHRvblwiKTtcclxuICAgICAgICB0aGlzLndlZWtCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dlZWstYnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFByb2plY3RCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FkZC1wcm9qZWN0LWJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2plY3RzLWxpc3RcIik7XHJcblxyXG4gICAgICAgIHRoaXMubWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1ib2R5LWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYWluSGVhZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1ib2R5LWNvbnRhaW5lciAucGFuZWwtaGVhZGluZ1wiKTtcclxuICAgICAgICB0aGlzLnRvZG9MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RvLWxpc3RcIik7XHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZGQtdGFzay1idXR0b25cIik7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlVGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3JlYXRlLXRhc2std2luZG93XCIpO1xyXG4gICAgICAgIHRoaXMudGFza0RhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Rhc2stZGF0ZVwiKTtcclxuICAgICAgICB0aGlzLnRhc2tQcm9qZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrLXByb2plY3RcIik7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0V2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jcmVhdGUtcHJvamVjdC13aW5kb3dcIik7XHJcblxyXG4gICAgICAgIHRoaXMucmVzZXRUYXNrRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucmVzZXRUYXNrUHJvamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXNldFRhc2tEYXRlKClcclxuICAgIHtcclxuICAgICAgICBsZXQgdG9kYXkgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc3BsaXQoXCJUXCIpWzBdO1xyXG4gICAgICAgIHRoaXMudGFza0RhdGUubWluID0gdG9kYXk7XHJcbiAgICAgICAgdGhpcy50YXNrRGF0ZS52YWx1ZSA9IHRvZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXNldFRhc2tQcm9qZWN0KClcclxuICAgIHtcclxuICAgICAgICBsZXQgcHJvamVjdHMgPSBEYXRhTWFuYWdlci5nZXRBbGxQcm9qZWN0cygpO1xyXG4gICAgICAgIHRoaXMudGFza1Byb2plY3QuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICBwcm9qZWN0cy5mb3JFYWNoKHByb2plY3QgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRhc2tQcm9qZWN0LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlT3B0aW9uKHByb2plY3QpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRhc2tQcm9qZWN0LmNoaWxkcmVuWzBdLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlT3B0aW9uKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgIG9wdC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIG9wdC50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHJldHVybiBvcHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzc2lnbkRPTUV2ZW50cygpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kaW1tZXIub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIERvbU1hbmFnZXIuaGlkZU92ZXJsYXlXaW5kb3coKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnRhc2tGb3JtLm9uc3VibWl0ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB0aGlzLnRhc2tGb3JtLnJlcG9ydFZhbGlkaXR5KCk7XHJcbiAgICAgICAgICAgIGlmIChmb3JtVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1WYWx1ZXMgPSBEb21NYW5hZ2VyLmdldEZvcm1WYWx1ZXModGhpcy50YXNrRm9ybSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5jcmVhdGVUb2RvKGZvcm1WYWx1ZXMudGl0bGUsIGZvcm1WYWx1ZXMuZGVzY3JpcHRpb24sIG5ldyBEYXRlKGZvcm1WYWx1ZXMuZGF0ZSksIGZvcm1WYWx1ZXMucHJpb3JpdHksIGZvcm1WYWx1ZXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFRvZG9zKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVPdmVybGF5V2luZG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnByb2plY3RGb3JtLm9uc3VibWl0ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB0aGlzLnByb2plY3RGb3JtLnJlcG9ydFZhbGlkaXR5KCk7XHJcbiAgICAgICAgICAgIGlmIChmb3JtVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1WYWx1ZXMgPSBEb21NYW5hZ2VyLmdldEZvcm1WYWx1ZXModGhpcy5wcm9qZWN0Rm9ybSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5jcmVhdGVQcm9qZWN0KGZvcm1WYWx1ZXMudGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlT3ZlcmxheVdpbmRvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd092ZXJsYXlXaW5kb3codGhpcy5jcmVhdGVUYXNrV2luZG93KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWRkUHJvamVjdEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dPdmVybGF5V2luZG93KHRoaXMuY3JlYXRlUHJvamVjdFdpbmRvdyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNyZWF0ZVRhc2tXaW5kb3cub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RXaW5kb3cub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hbGxCdXR0b24ub25jbGljayA9ICgpID0+IHt0aGlzLmxvYWRBbGxQYWdlKCl9O1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24ub25jbGljayA9ICgpID0+IHt0aGlzLmxvYWRUb2RheVBhZ2UoKX07XHJcbiAgICAgICAgdGhpcy53ZWVrQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7dGhpcy5sb2FkV2Vla1BhZ2UoKX07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRBbGxQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZEFsbFBhZ2UoKTtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFByb2plY3RzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hbGxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLndlZWtCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuYWRkVGFza0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVG9kYXlQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFRvZGF5UGFnZSgpO1xyXG4gICAgICAgIHRoaXMubmF2TWFuYWdlci5sb2FkUHJvamVjdHMoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFdlZWtQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFdlZWtQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2RheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBcclxuICAgICAgICB0aGlzLmFkZFRhc2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkUHJvamVjdFBhZ2UoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2RheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFRhc2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2hvd092ZXJsYXlXaW5kb3cgPSAod2luZG93Tm9kZSkgPT5cclxuICAgIHtcclxuICAgICAgICB0aGlzLmRpbW1lci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIHdpbmRvd05vZGUuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgICAgIHRoaXMub3Blbk92ZXJsYXkgPSB3aW5kb3dOb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBoaWRlT3ZlcmxheVdpbmRvdyA9ICgpID0+XHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kaW1tZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIGlmICh0aGlzLm9wZW5PdmVybGF5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFza0Zvcm0ucmVzZXQoKTtcclxuICAgICAgICB0aGlzLnByb2plY3RGb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5yZXNldFRhc2tEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldFRhc2tQcm9qZWN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEZvcm1WYWx1ZXMoZm9ybSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG4gICAgICAgIGxldCByZXMgPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmVzW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlTmF2QnV0dG9uKHRleHQpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgIGxpLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgICBsaS5jbGFzc05hbWUgPSBcIm5hdi1idXR0b25cIjtcclxuICAgICAgICByZXR1cm4gbGk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZVRvZG9JdGVtKG5hbWUsIGRlc2NyaXB0aW9uLCBkYXRlLCBwcm9qZWN0KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpOztcclxuICAgICAgICBsaS5jbGFzc05hbWUgPSBcInRvZG8taXRlbVwiO1xyXG5cclxuICAgICAgICBjb25zdCB0b2RvQ29tcGxldGVCdXR0b25Db250YWluZXIgPSBjcmVhdGVUb2RvQnV0dG9uQ29udGFpbmVyKFwi4pyTXCIpO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9OYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0b2RvTmFtZS5jbGFzc05hbWUgPSBcInRvZG8tbmFtZVwiO1xyXG4gICAgICAgIHRvZG9OYW1lLnRpdGxlID0gZGVzY3JpcHRpb247XHJcbiAgICAgICAgdG9kb05hbWUudGV4dENvbnRlbnQgPSBgJHtuYW1lfSAoJHtwcm9qZWN0fSlgO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9OYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9kb0RhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRvZG9EYXRlLmNsYXNzTmFtZSA9IFwidG9kby1kYXRlXCI7XHJcbiAgICAgICAgdG9kb0RhdGUudGV4dENvbnRlbnQgPSBDdXN0b21EYXRlLmdldFN0cmluZ0Zyb21EYXRlKGRhdGUpO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9EYXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtsaSwgdG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlVG9kb0J1dHRvbkNvbnRhaW5lcihidXR0b25UZXh0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgdG9kb0J1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHRvZG9CdXR0b25Db250YWluZXIuY2xhc3NOYW1lID0gXCJ0b2RvLWJ1dHRvbi1jb250YWluZXJcIjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICAgIGJ0bi5jbGFzc05hbWUgPSBcInRvZG8tYnV0dG9uXCI7XHJcbiAgICAgICAgICAgIGJ0bi50YWJJbmRleCA9IC0xO1xyXG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBidXR0b25UZXh0O1xyXG4gICAgICAgICAgICB0b2RvQnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ0bik7XHJcbiAgICAgICAgICAgIHJldHVybiB0b2RvQnV0dG9uQ29udGFpbmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZW5hYmxlQWxsUHJpbWFyeUJ1dHRvbnMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2RheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEb21NYW5hZ2VyOyIsImltcG9ydCBEb21NYW5hZ2VyIGZyb20gXCIuL2RvbVwiO1xyXG5pbXBvcnQgRGF0YU1hbmFnZXIgZnJvbSBcIi4vdG9kb3NcIjtcclxuXHJcbmNsYXNzIE5hdk1hbmFnZXJcclxue1xyXG4gICAgY3VycmVudFBhZ2U7XHJcbiAgICBjdXJyZW50UHJvamVjdDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGhlYWRpbmcsIHRvZG9MaXN0LCBwcm9qZWN0TGlzdClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmhlYWRpbmcgPSBoZWFkaW5nO1xyXG4gICAgICAgIHRoaXMudG9kb0xpc3QgPSB0b2RvTGlzdDtcclxuICAgICAgICB0aGlzLnByb2plY3RMaXN0ID0gcHJvamVjdExpc3Q7XHJcblxyXG4gICAgICAgIHRoaXMucHJvamVjdEJ1dHRvbnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUHJvamVjdHMoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBwcm9qZWN0cyA9IERhdGFNYW5hZ2VyLmdldEFsbFByb2plY3RzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0TGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMucHJvamVjdEJ1dHRvbnMgPSBbXTtcclxuICAgICAgICBwcm9qZWN0cy5mb3JFYWNoKHByb2plY3ROYW1lID0+IHtcclxuICAgICAgICAgICAgbGV0IGJ0biA9IERvbU1hbmFnZXIuY3JlYXRlTmF2QnV0dG9uKHByb2plY3ROYW1lKTtcclxuICAgICAgICAgICAgYnRuLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRQcm9qZWN0UGFnZShwcm9qZWN0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBidG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgYnRuUmVtb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICAgICAgYnRuUmVtb3ZlLmNsYXNzTmFtZSA9IFwicHJvamVjdC1kZWxldGUtYnV0dG9uXCI7XHJcbiAgICAgICAgICAgIGJ0blJlbW92ZS50ZXh0Q29udGVudCA9IFwiWFwiO1xyXG4gICAgICAgICAgICBidG4uYXBwZW5kQ2hpbGQoYnRuUmVtb3ZlKTtcclxuICAgICAgICAgICAgYnRuUmVtb3ZlLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5nZXRBbGxQcm9qZWN0cygpLmxlbmd0aCA+IDEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIucmVtb3ZlUHJvamVjdChwcm9qZWN0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVG9kb3MoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZEFsbFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RMaXN0LmFwcGVuZENoaWxkKGJ0bik7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdEJ1dHRvbnMucHVzaChidG4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRUb2Rvcyhwcm9qZWN0TmFtZSlcclxuICAgIHtcclxuICAgICAgICBpZiAocHJvamVjdE5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdE5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09PSBcIkFsbFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQW5kQXNzaWduVG9kb3NGcm9tTGlzdChEYXRhTWFuYWdlci5nZXRBbGxUb2RvcygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5jdXJyZW50UGFnZSA9PT0gXCJUb2RheVwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkQW5kQXNzaWduVG9kb3NGcm9tTGlzdChEYXRhTWFuYWdlci5nZXRUb2Rvc0Zyb21Ub2RheSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5jdXJyZW50UGFnZSA9PT0gXCJXZWVrXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KERhdGFNYW5hZ2VyLmdldFRvZG9zRnJvbVRoaXNXZWVrKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmN1cnJlbnRQYWdlID09PSBcIlByb2plY3RcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QoRGF0YU1hbmFnZXIuZ2V0VG9kb3NGcm9tUHJvamVjdCh0aGlzLmN1cnJlbnRQcm9qZWN0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0VSUk9SXTogTG9hZGluZyB0b2RvcyBmb3IgdW5rbm93biBwYWdlIVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QodG9kb3MpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50b2RvTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIGlmICghdG9kb3MgfHwgdG9kb3MubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc29ydGVkID0gdG9kb3Muc29ydCgoYSwgYikgPT4gYS5wcmlvcml0eSA+IGIucHJpb3JpdHkgPyAtMSA6IDEpO1xyXG4gICAgICAgIHNvcnRlZC5mb3JFYWNoKHRvZG8gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7bGksIHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lcn0gPSBEb21NYW5hZ2VyLmNyZWF0ZVRvZG9JdGVtKHRvZG8udGl0bGUsIHRvZG8uZGVzY3JpcHRpb24sIHRvZG8uZHVlRGF0ZSwgdG9kby5wcm9qZWN0KTtcclxuICAgICAgICAgICAgdG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG9MaXN0LnJlbW92ZUNoaWxkKGxpKTtcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLnJlbW92ZVRvZG8odG9kby50aXRsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHByaW9yaXR5Q2xhc3MgPSB0b2RvLnByaW9yaXR5ID09PSBcIjBcIiA/IFwiZ3JlZW5cIiA6ICh0b2RvLnByaW9yaXR5ID09PSBcIjFcIiA/IFwib3JhbmdlXCIgOiBcInJlZFwiKTtcclxuICAgICAgICAgICAgdG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyLmNoaWxkcmVuWzBdLmNsYXNzTGlzdC5hZGQocHJpb3JpdHlDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRvZG9MaXN0LmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkQWxsUGFnZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IFwiQWxsXCI7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nLnRleHRDb250ZW50ID0gXCJBbGwgdGFza3NcIjtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkVG9kb3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkVG9kYXlQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gXCJUb2RheVwiO1xyXG4gICAgICAgIHRoaXMuaGVhZGluZy50ZXh0Q29udGVudCA9IFwiVG9kYXkncyB0YXNrc1wiO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRUb2RvcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRXZWVrUGFnZSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IFwiV2Vla1wiO1xyXG4gICAgICAgIHRoaXMuaGVhZGluZy50ZXh0Q29udGVudCA9IFwiVGhpcyB3ZWVrJ3MgdGFza3NcIjtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkVG9kb3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkUHJvamVjdFBhZ2UobmFtZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gXCJQcm9qZWN0XCI7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nLnRleHRDb250ZW50ID0gYCR7bmFtZX0ncyB0b2Rvc2A7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFRvZG9zKG5hbWUpO1xyXG4gICAgICAgIERvbU1hbmFnZXIubG9hZFByb2plY3RQYWdlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdk1hbmFnZXI7IiwiaW1wb3J0IHtEYXRlTWFuYWdlciwgQ3VzdG9tRGF0ZX0gZnJvbSBcIi4vZGF0ZU1hbmFnZXJcIjtcclxuaW1wb3J0IERvbU1hbmFnZXIgZnJvbSBcIi4vZG9tXCI7XHJcblxyXG5jbGFzcyBUb2RvIHtcclxuICAgIGNvbnN0cnVjdG9yKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHByb2plY3QpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgICAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xyXG4gICAgICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSBwcm9qZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGUodmFsKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZHVlRGF0ZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQcm9qZWN0KHZhbClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnByb2plY3QgPSB2YWw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERhdGFNYW5hZ2VyIHtcclxuICAgIHN0YXRpYyB0b2RvcyA9IFtdO1xyXG4gICAgc3RhdGljIHByb2plY3RzID0gW107XHJcblxyXG4gICAgc3RhdGljXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5sb2FkRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkRGF0YSgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0cyA9IEpTT04ucGFyc2Uod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicHJvamVjdHNcIikpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMucHJvamVjdHMgfHwgdGhpcy5wcm9qZWN0cy5sZW5ndGggPT09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RzID0gW1wiTmV3IFByb2plY3RcIl07XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByb2plY3RzXCIsIEpTT04uc3RyaW5naWZ5KHRoaXMucHJvamVjdHMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudG9kb3MgPSBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRvZG9zXCIpKTtcclxuICAgICAgICBpZiAoIXRoaXMudG9kb3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnRvZG9zID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnByb2plY3RzKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnRvZG9zKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlUHJvamVjdChuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdHMuaW5jbHVkZXMobmFtZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUHJvamVjdCBhbHJlYWR5IGV4aXN0cyFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RzLnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcm9qZWN0c1wiLCBKU09OLnN0cmluZ2lmeSh0aGlzLnByb2plY3RzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJJbnZhbGlkIHByb2plY3QgbmFtZSFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIERvbU1hbmFnZXIucmVzZXRUYXNrUHJvamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHByb2plY3QpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9kb3NbaV0udGl0bGUgPT09IHRpdGxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlRhc2sgbmFtZSBtdXN0IGJlIHVuaXF1ZSFcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghKGR1ZURhdGUgaW5zdGFuY2VvZiBDdXN0b21EYXRlKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGR1ZURhdGUgPSBDdXN0b21EYXRlLmNyZWF0ZUZyb21EYXRlT2JqZWN0KGR1ZURhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRvZG8gPSBuZXcgVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0KTtcclxuICAgICAgICB0aGlzLnRvZG9zLnB1c2godG9kbyk7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9kb3NcIiwgSlNPTi5zdHJpbmdpZnkodGhpcy50b2RvcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRBbGxUb2RvcygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9kb3M7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEFsbFByb2plY3RzKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0cztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0VG9kb3NGcm9tVG9kYXkoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCB0b2RheSA9IERhdGVNYW5hZ2VyLmdldFRvZGF5RGF0ZSgpO1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKERhdGVNYW5hZ2VyLmFyZURhdGVzRXF1YWwodG9kYXksIHRoaXMudG9kb3NbaV0uZHVlRGF0ZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgb3V0LnB1c2godGhpcy50b2Rvc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0VG9kb3NGcm9tVGhpc1dlZWsoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCB0b2RheVdlZWsgPSBEYXRlTWFuYWdlci5nZXRUb2RheVdlZWsoKTtcclxuXHJcbiAgICAgICAgbGV0IG91dCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZG9zW2ldLmR1ZURhdGUud2VlayA9PT0gdG9kYXlXZWVrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvdXQucHVzaCh0aGlzLnRvZG9zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2Rvc0Zyb21Qcm9qZWN0KHByb2plY3ROYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBvdXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS5wcm9qZWN0ID09PSBwcm9qZWN0TmFtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb3V0LnB1c2godGhpcy50b2Rvc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVtb3ZlVG9kbyhuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZG9zW2ldLnRpdGxlID09PSBuYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG9zLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZW1vdmVQcm9qZWN0KG5hbWUpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb2plY3RzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdHNbaV0gPT09IG5hbWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcm9qZWN0cy5sZW5ndGggPT09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RzLnB1c2goXCJOZXcgUHJvamVjdFwiKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicHJvamVjdHNcIiwgSlNPTi5zdHJpbmdpZnkodGhpcy5wcm9qZWN0cykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5ld1RvZG9zID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9kb3NbaV0ucHJvamVjdCAhPT0gbmFtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmV3VG9kb3MucHVzaCh0aGlzLnRvZG9zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRvZG9zID0gbmV3VG9kb3M7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidG9kb3NcIiwgSlNPTi5zdHJpbmdpZnkodGhpcy50b2RvcykpO1xyXG4gICAgICAgIERvbU1hbmFnZXIucmVzZXRUYXNrUHJvamVjdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXRhTWFuYWdlcjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBEb21NYW5hZ2VyIGZyb20gJy4vbW9kdWxlcy9kb20uanMnO1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgRG9tTWFuYWdlci5sb2FkQWxsUGFnZSgpO1xyXG59KSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==