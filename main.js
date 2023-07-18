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
        this.createProjectWindow = document.querySelector(".create-project-window");

        this.resetTaskDate();
    }

    static resetTaskDate()
    {
        let today = new Date().toISOString().split("T")[0];
        this.taskDate.min = today;
        this.taskDate.value = today;
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
        
                _todos__WEBPACK_IMPORTED_MODULE_0__["default"].createTodo(formValues.title, formValues.description, new Date(formValues.date), 0, "");
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

    static createTodoItem(name, date)
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

    constructor(container, heading, todoList, projectList)
    {
        this.container = container;
        this.heading = heading;
        this.todoList = todoList;
        this.projectList = projectList;
    }

    loadProjects()
    {
        let projects = _todos__WEBPACK_IMPORTED_MODULE_1__["default"].getAllProjects();
        this.projectList.innerHTML = "";
        projects.forEach(projectName => {
            let btn = _dom__WEBPACK_IMPORTED_MODULE_0__["default"].createNavButton(projectName)
            this.projectList.appendChild(btn);
        });
    }

    loadTodos()
    {
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
            console.log("Loading project stuff...");
        }
        else
        {
            console.log("Loading error page todos!");
        }
    }

    loadAndAssignTodosFromList(todos)
    {
        this.todoList.innerHTML = "";
        todos.forEach(todo => {
            const {li, todoCompleteButtonContainer, todoRemoveButtonContainer} = _dom__WEBPACK_IMPORTED_MODULE_0__["default"].createTodoItem(todo.title, todo.dueDate);
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
        this.todoList.innerHTML = "";

        this.loadTodos();
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

        if (this.projects.length === 0)
        {
            this.projects = ["New Project"];
        }
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
/* harmony import */ var _modules_dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/dom.js */ "./src/modules/dom.js");


(function() {
    _modules_dom_js__WEBPACK_IMPORTED_MODULE_0__["default"].loadAllPage();
})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLG9EQUFVO0FBQzNDO0FBQ0Esc0JBQXNCLG9EQUFVO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixxREFBVztBQUMvQjtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBLGdCQUFnQixxREFBVztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxREFBVztBQUNuQztBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxXQUFXOzs7Ozs7VUN6STFCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOMEM7QUFDMUM7QUFDQTtBQUNBLElBQUksdURBQVU7QUFDZCxDQUFDLEkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2RhdGVNYW5hZ2VyLmpzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvZG9tLmpzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvbmF2LmpzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvdG9kb3MuanMiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBDdXN0b21EYXRlXHJcbntcclxuICAgIGNvbnN0cnVjdG9yKGRheSwgbW9udGgsIHllYXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kYXkgPSBkYXk7XHJcbiAgICAgICAgdGhpcy5tb250aCA9IG1vbnRoO1xyXG4gICAgICAgIHRoaXMueWVhciA9IHllYXI7XHJcblxyXG4gICAgICAgIHRoaXMud2VlayA9IHRoaXMuZ2V0V2Vla0Zyb21EYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZUZyb21EYXRlT2JqZWN0KGRhdGUpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFkYXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgQ3VzdG9tRGF0ZShkYXRlLmdldERhdGUoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldEZ1bGxZZWFyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFdlZWtGcm9tRGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnREYXRlID0gbmV3IERhdGUodGhpcy55ZWFyLCB0aGlzLm1vbnRoLCB0aGlzLmRheSwgbmV3IERhdGUoKS5nZXRIb3VycygpLCBuZXcgRGF0ZSgpLmdldE1pbnV0ZXMoKSk7XHJcbiAgICAgICAgbGV0IGJlZ2lubmluZ09mWWVhciA9IG5ldyBEYXRlKHRoaXMueWVhciwgMCwgMSk7XHJcbiAgICAgICAgbGV0IGRheXMgPSBNYXRoLmZsb29yKChjdXJyZW50RGF0ZSAtIGJlZ2lubmluZ09mWWVhcikgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ZWVrTnVtYmVyID0gTWF0aC5jZWlsKGRheXMgLyA3KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gd2Vla051bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTdHJpbmdGcm9tRGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGRheSA9IHRoaXMuZGF5LnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpO1xyXG4gICAgICAgIGxldCBtb250aCA9ICh0aGlzLm1vbnRoICsgMSkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XHJcbiAgICAgICAgcmV0dXJuIGAke2RheX0vJHttb250aH0vJHt0aGlzLnllYXJ9YDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGF0ZU1hbmFnZXJcclxue1xyXG4gICAgc3RhdGljIGdldFRvZGF5RGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiBuZXcgQ3VzdG9tRGF0ZShkYXRlLmdldERhdGUoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldEZ1bGxZZWFyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2RheVdlZWsoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRvZGF5RGF0ZSgpLmdldFdlZWtGcm9tRGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhcmVEYXRlc0VxdWFsKGRhdGUxLCBkYXRlMilcclxuICAgIHtcclxuICAgICAgICBpZiAoIWRhdGUxIHx8ICFkYXRlMikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBkYXRlMS5kYXkgPT09IGRhdGUyLmRheSAmJiBcclxuICAgICAgICAgICAgICAgZGF0ZTEubW9udGggPT09IGRhdGUyLm1vbnRoICYmIFxyXG4gICAgICAgICAgICAgICBkYXRlMS55ZWFyID09PSBkYXRlMi55ZWFyO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQge0RhdGVNYW5hZ2VyLCBDdXN0b21EYXRlfTsiLCJpbXBvcnQgRGF0YU1hbmFnZXIgZnJvbSBcIi4vdG9kb3NcIjtcclxuaW1wb3J0IE5hdk1hbmFnZXIgZnJvbSBcIi4vbmF2XCI7XHJcblxyXG5jbGFzcyBEb21NYW5hZ2VyXHJcbntcclxuICAgIHN0YXRpYyBvcGVuT3ZlcmxheSA9IG51bGw7XHJcblxyXG4gICAgc3RhdGljIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubG9hZERPTVJlZmVyZW5jZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5uYXZNYW5hZ2VyID0gbmV3IE5hdk1hbmFnZXIodGhpcy5tYWluQ29udGFpbmVyLCB0aGlzLm1haW5IZWFkaW5nLCB0aGlzLnRvZG9MaXN0LCB0aGlzLnByb2plY3RzTGlzdCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hc3NpZ25ET01FdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZERPTVJlZmVyZW5jZXMoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGltbWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaW1tZXJcIik7XHJcbiAgICAgICAgdGhpcy50YXNrRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGFzay1mb3JtXCIpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2plY3QtZm9ybVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbGxCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FsbC1idXR0b25cIik7XHJcbiAgICAgICAgdGhpcy50b2RheUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdG9kYXktYnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2Vlay1idXR0b25cIik7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkUHJvamVjdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWRkLXByb2plY3QtYnV0dG9uXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnByb2plY3RzTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvamVjdHMtbGlzdFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5tYWluQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWJvZHktY29udGFpbmVyXCIpO1xyXG5cclxuICAgICAgICB0aGlzLm1haW5IZWFkaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWJvZHktY29udGFpbmVyIC5wYW5lbC1oZWFkaW5nXCIpO1xyXG4gICAgICAgIHRoaXMudG9kb0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZG8tbGlzdFwiKTtcclxuICAgICAgICB0aGlzLmFkZFRhc2tCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FkZC10YXNrLWJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jcmVhdGUtdGFzay13aW5kb3dcIik7XHJcbiAgICAgICAgdGhpcy50YXNrRGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGFzay1kYXRlXCIpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdFdpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3JlYXRlLXByb2plY3Qtd2luZG93XCIpO1xyXG5cclxuICAgICAgICB0aGlzLnJlc2V0VGFza0RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVzZXRUYXNrRGF0ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcclxuICAgICAgICB0aGlzLnRhc2tEYXRlLm1pbiA9IHRvZGF5O1xyXG4gICAgICAgIHRoaXMudGFza0RhdGUudmFsdWUgPSB0b2RheTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXNzaWduRE9NRXZlbnRzKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRpbW1lci5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgRG9tTWFuYWdlci5oaWRlT3ZlcmxheVdpbmRvdygpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudGFza0Zvcm0ub25zdWJtaXQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcm1WYWxpZCA9IHRoaXMudGFza0Zvcm0ucmVwb3J0VmFsaWRpdHkoKTtcclxuICAgICAgICAgICAgaWYgKGZvcm1WYWxpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZm9ybVZhbHVlcyA9IERvbU1hbmFnZXIuZ2V0Rm9ybVZhbHVlcyh0aGlzLnRhc2tGb3JtKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmNyZWF0ZVRvZG8oZm9ybVZhbHVlcy50aXRsZSwgZm9ybVZhbHVlcy5kZXNjcmlwdGlvbiwgbmV3IERhdGUoZm9ybVZhbHVlcy5kYXRlKSwgMCwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFRvZG9zKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVPdmVybGF5V2luZG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnByb2plY3RGb3JtLm9uc3VibWl0ID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB0aGlzLnByb2plY3RGb3JtLnJlcG9ydFZhbGlkaXR5KCk7XHJcbiAgICAgICAgICAgIGlmIChmb3JtVmFsaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1WYWx1ZXMgPSBEb21NYW5hZ2VyLmdldEZvcm1WYWx1ZXModGhpcy5wcm9qZWN0Rm9ybSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5jcmVhdGVQcm9qZWN0KGZvcm1WYWx1ZXMudGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlT3ZlcmxheVdpbmRvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd092ZXJsYXlXaW5kb3codGhpcy5jcmVhdGVUYXNrV2luZG93KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWRkUHJvamVjdEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dPdmVybGF5V2luZG93KHRoaXMuY3JlYXRlUHJvamVjdFdpbmRvdyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNyZWF0ZVRhc2tXaW5kb3cub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RXaW5kb3cub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hbGxCdXR0b24ub25jbGljayA9ICgpID0+IHt0aGlzLmxvYWRBbGxQYWdlKCl9O1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24ub25jbGljayA9ICgpID0+IHt0aGlzLmxvYWRUb2RheVBhZ2UoKX07XHJcbiAgICAgICAgdGhpcy53ZWVrQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7dGhpcy5sb2FkV2Vla1BhZ2UoKX07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRBbGxQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZEFsbFBhZ2UoKTtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFByb2plY3RzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hbGxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLndlZWtCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMuYWRkVGFza0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVG9kYXlQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFRvZGF5UGFnZSgpO1xyXG4gICAgICAgIHRoaXMubmF2TWFuYWdlci5sb2FkUHJvamVjdHMoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmFsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG9kYXlCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5hZGRUYXNrQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFdlZWtQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm5hdk1hbmFnZXIubG9hZFdlZWtQYWdlKCk7XHJcbiAgICAgICAgdGhpcy5uYXZNYW5hZ2VyLmxvYWRQcm9qZWN0cygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b2RheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2Vla0J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBcclxuICAgICAgICB0aGlzLmFkZFRhc2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzaG93T3ZlcmxheVdpbmRvdyA9ICh3aW5kb3dOb2RlKSA9PlxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGltbWVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgd2luZG93Tm9kZS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgdGhpcy5vcGVuT3ZlcmxheSA9IHdpbmRvd05vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGhpZGVPdmVybGF5V2luZG93ID0gKCkgPT5cclxuICAgIHtcclxuICAgICAgICB0aGlzLmRpbW1lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgaWYgKHRoaXMub3Blbk92ZXJsYXkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW5PdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YXNrRm9ybS5yZXNldCgpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdEZvcm0ucmVzZXQoKTtcclxuICAgICAgICB0aGlzLnJlc2V0VGFza0RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0Rm9ybVZhbHVlcyhmb3JtKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcbiAgICAgICAgbGV0IHJlcyA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXNba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVOYXZCdXR0b24odGV4dClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgICBsaS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgbGkuY2xhc3NOYW1lID0gXCJuYXYtYnV0dG9uXCI7XHJcbiAgICAgICAgcmV0dXJuIGxpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVUb2RvSXRlbShuYW1lLCBkYXRlKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpOztcclxuICAgICAgICBsaS5jbGFzc05hbWUgPSBcInRvZG8taXRlbVwiO1xyXG5cclxuICAgICAgICBjb25zdCB0b2RvQ29tcGxldGVCdXR0b25Db250YWluZXIgPSBjcmVhdGVUb2RvQnV0dG9uQ29udGFpbmVyKFwi4pyTXCIpO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9OYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0b2RvTmFtZS5jbGFzc05hbWUgPSBcInRvZG8tbmFtZVwiO1xyXG4gICAgICAgIHRvZG9OYW1lLnRleHRDb250ZW50ID0gbmFtZTtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZCh0b2RvTmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9EYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0b2RvRGF0ZS5jbGFzc05hbWUgPSBcInRvZG8tZGF0ZVwiO1xyXG4gICAgICAgIHRvZG9EYXRlLnRleHRDb250ZW50ID0gZGF0ZS5nZXRTdHJpbmdGcm9tRGF0ZSgpO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9EYXRlKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9kb1JlbW92ZUJ1dHRvbkNvbnRhaW5lciA9IGNyZWF0ZVRvZG9CdXR0b25Db250YWluZXIoXCJYXCIpO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9SZW1vdmVCdXR0b25Db250YWluZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4ge2xpLCB0b2RvQ29tcGxldGVCdXR0b25Db250YWluZXIsIHRvZG9SZW1vdmVCdXR0b25Db250YWluZXJ9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVUb2RvQnV0dG9uQ29udGFpbmVyKGJ1dHRvblRleHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCB0b2RvQnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgdG9kb0J1dHRvbkNvbnRhaW5lci5jbGFzc05hbWUgPSBcInRvZG8tYnV0dG9uLWNvbnRhaW5lclwiO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICAgICAgYnRuLmNsYXNzTmFtZSA9IFwidG9kby1idXR0b25cIjtcclxuICAgICAgICAgICAgYnRuLnRhYkluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IGJ1dHRvblRleHQ7XHJcbiAgICAgICAgICAgIHRvZG9CdXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoYnRuKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRvZG9CdXR0b25Db250YWluZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEb21NYW5hZ2VyOyIsImltcG9ydCBEb21NYW5hZ2VyIGZyb20gXCIuL2RvbVwiO1xyXG5pbXBvcnQgRGF0YU1hbmFnZXIgZnJvbSBcIi4vdG9kb3NcIjtcclxuXHJcbmNsYXNzIE5hdk1hbmFnZXJcclxue1xyXG4gICAgY3VycmVudFBhZ2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyLCBoZWFkaW5nLCB0b2RvTGlzdCwgcHJvamVjdExpc3QpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nID0gaGVhZGluZztcclxuICAgICAgICB0aGlzLnRvZG9MaXN0ID0gdG9kb0xpc3Q7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0TGlzdCA9IHByb2plY3RMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRQcm9qZWN0cygpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHByb2plY3RzID0gRGF0YU1hbmFnZXIuZ2V0QWxsUHJvamVjdHMoKTtcclxuICAgICAgICB0aGlzLnByb2plY3RMaXN0LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgcHJvamVjdHMuZm9yRWFjaChwcm9qZWN0TmFtZSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBidG4gPSBEb21NYW5hZ2VyLmNyZWF0ZU5hdkJ1dHRvbihwcm9qZWN0TmFtZSlcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0TGlzdC5hcHBlbmRDaGlsZChidG4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRUb2RvcygpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT09IFwiQWxsXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KERhdGFNYW5hZ2VyLmdldEFsbFRvZG9zKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmN1cnJlbnRQYWdlID09PSBcIlRvZGF5XCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KERhdGFNYW5hZ2VyLmdldFRvZG9zRnJvbVRvZGF5KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmN1cnJlbnRQYWdlID09PSBcIldlZWtcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QoRGF0YU1hbmFnZXIuZ2V0VG9kb3NGcm9tVGhpc1dlZWsoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT09IFwiUHJvamVjdFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIHByb2plY3Qgc3R1ZmYuLi5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBlcnJvciBwYWdlIHRvZG9zIVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QodG9kb3MpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy50b2RvTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHRvZG9zLmZvckVhY2godG9kbyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtsaSwgdG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyLCB0b2RvUmVtb3ZlQnV0dG9uQ29udGFpbmVyfSA9IERvbU1hbmFnZXIuY3JlYXRlVG9kb0l0ZW0odG9kby50aXRsZSwgdG9kby5kdWVEYXRlKTtcclxuICAgICAgICAgICAgdG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG9MaXN0LnJlbW92ZUNoaWxkKGxpKTtcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLnJlbW92ZVRvZG8odG9kby50aXRsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdG9kb1JlbW92ZUJ1dHRvbkNvbnRhaW5lci5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2RvTGlzdC5yZW1vdmVDaGlsZChsaSk7XHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5yZW1vdmVUb2RvKHRvZG8udGl0bGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudG9kb0xpc3QuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRBbGxQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gXCJBbGxcIjtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBcIkFsbCB0YXNrc1wiO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRUb2RvcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRUb2RheVBhZ2UoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBcIlRvZGF5XCI7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nLnRleHRDb250ZW50ID0gXCJUb2RheSdzIHRhc2tzXCI7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFRvZG9zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFdlZWtQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gXCJXZWVrXCI7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nLnRleHRDb250ZW50ID0gXCJUaGlzIHdlZWsncyB0YXNrc1wiO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRUb2RvcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRQcm9qZWN0UGFnZShuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBcIlByb2plY3RcIjtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBgJHtuYW1lfSdzIHRvZG9zYDtcclxuICAgICAgICB0aGlzLnRvZG9MaXN0LmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFRvZG9zKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdk1hbmFnZXI7IiwiaW1wb3J0IHtEYXRlTWFuYWdlciwgQ3VzdG9tRGF0ZX0gZnJvbSBcIi4vZGF0ZU1hbmFnZXJcIjtcclxuXHJcbmNsYXNzIFRvZG8ge1xyXG4gICAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgcHJvamVjdClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XHJcbiAgICAgICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0ZSh2YWwpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kdWVEYXRlID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFByb2plY3QodmFsKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHZhbDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGF0YU1hbmFnZXIge1xyXG4gICAgc3RhdGljIHRvZG9zID0gW107XHJcbiAgICBzdGF0aWMgcHJvamVjdHMgPSBbXTtcclxuXHJcbiAgICBzdGF0aWNcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxvYWREYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWREYXRhKClcclxuICAgIHtcclxuICAgICAgICAvLyBMb2FkIGR1bW15IGRhdGEgZm9yIG5vd1xyXG4gICAgICAgIHRoaXMuY3JlYXRlVG9kbyhcIkdpbWxpMVwiLCBcIkEgZHdhcmYncyB0YXNrIDFcIiwgbmV3IEN1c3RvbURhdGUoMTcsIDYsIDIwMjMpLCAyLCBcIkR3YXJ2ZW4gU3R1ZmZcIik7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVUb2RvKFwiR2ltbGkyXCIsIFwiQSBkd2FyZidzIHRhc2sgMlwiLCBuZXcgQ3VzdG9tRGF0ZSgxOCwgNiwgMjAyMyksIDMsIFwiRHdhcnZlbiBTdHVmZlwiKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVRvZG8oXCJHaW1saTNcIiwgXCJBIGR3YXJmJ3MgdGFzayAzXCIsIG5ldyBDdXN0b21EYXRlKDI0LCA2LCAyMDIzKSwgNCwgXCJFbHZlbiBTdHVmZlwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJvamVjdHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0cyA9IFtcIk5ldyBQcm9qZWN0XCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlUHJvamVjdChuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdHMuaW5jbHVkZXMobmFtZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUHJvamVjdCBhbHJlYWR5IGV4aXN0cyFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RzLnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYWxlcnQoXCJJbnZhbGlkIHByb2plY3QgbmFtZSFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHByb2plY3QpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9kb3NbaV0udGl0bGUgPT09IHRpdGxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlRhc2sgbmFtZSBtdXN0IGJlIHVuaXF1ZSFcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghKGR1ZURhdGUgaW5zdGFuY2VvZiBDdXN0b21EYXRlKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGR1ZURhdGUgPSBDdXN0b21EYXRlLmNyZWF0ZUZyb21EYXRlT2JqZWN0KGR1ZURhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRvZG8gPSBuZXcgVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0KTtcclxuICAgICAgICB0aGlzLnRvZG9zLnB1c2godG9kbyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldEFsbFRvZG9zKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b2RvcztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0QWxsUHJvamVjdHMoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2plY3RzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2Rvc0Zyb21Ub2RheSgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHRvZGF5ID0gRGF0ZU1hbmFnZXIuZ2V0VG9kYXlEYXRlKCk7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoRGF0ZU1hbmFnZXIuYXJlRGF0ZXNFcXVhbCh0b2RheSwgdGhpcy50b2Rvc1tpXS5kdWVEYXRlKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBvdXQucHVzaCh0aGlzLnRvZG9zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2Rvc0Zyb21UaGlzV2VlaygpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHRvZGF5V2VlayA9IERhdGVNYW5hZ2VyLmdldFRvZGF5V2VlaygpO1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9kb3NbaV0uZHVlRGF0ZS53ZWVrID09PSB0b2RheVdlZWspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG91dC5wdXNoKHRoaXMudG9kb3NbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlbW92ZVRvZG8obmFtZSlcclxuICAgIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS50aXRsZSA9PT0gbmFtZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGFNYW5hZ2VyOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IERvbU1hbmFnZXIgZnJvbSAnLi9tb2R1bGVzL2RvbS5qcyc7XHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICBEb21NYW5hZ2VyLmxvYWRBbGxQYWdlKCk7XHJcbn0pKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9