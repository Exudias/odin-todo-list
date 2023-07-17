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
class DomManager
{
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
        this.todoList.innerHTML = "";

        this.loadAndAssignTodosFromList(_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getAllTodos());
    }

    loadAndAssignTodosFromList(todos)
    {
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
        this.todoList.innerHTML = "";

        this.loadAndAssignTodosFromList(_todos__WEBPACK_IMPORTED_MODULE_1__["default"].getTodosFromToday());
    }

    loadWeekPage()
    {
        this.heading.textContent = "This week's tasks";
        this.todoList.innerHTML = "";

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
        if (!name)
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

        let todo = new Todo(title, description, dueDate, priority, project);
        this.todos.push(todo);
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
            console.log(todayWeek);
            console.log(this.todos[i].dueDate.week);
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

const navManager = new _modules_nav_js__WEBPACK_IMPORTED_MODULE_2__["default"](mainContainer, mainHeading, todoList);

(function() {
    loadAll();
})();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLElBQUksR0FBRyxPQUFPLEVBQUUsVUFBVTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsVUFBVTs7Ozs7Ozs7Ozs7Ozs7OztBQ2hETTtBQUNHO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qyw4Q0FBVztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDREQUE0RCxFQUFFLDRDQUFVO0FBQzNGO0FBQ0E7QUFDQSxnQkFBZ0IsOENBQVc7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDhDQUFXO0FBQzNCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsOENBQVc7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsOENBQVc7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsS0FBSztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7QUM3RDZCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBELG9EQUFVO0FBQ3BFLDBEQUEwRCxvREFBVTtBQUNwRSwwREFBMEQsb0RBQVU7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IscURBQVc7QUFDL0I7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQSxnQkFBZ0IscURBQVc7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IscURBQVc7QUFDbkM7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFlLFdBQVc7Ozs7OztVQzVIMUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTnVEO0FBQ2I7QUFDQTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1REFBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2RhdGVNYW5hZ2VyLmpzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvZG9tLmpzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvbmF2LmpzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvdG9kb3MuanMiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29kaW4tdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2Rpbi10b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLXRvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBDdXN0b21EYXRlXHJcbntcclxuICAgIGNvbnN0cnVjdG9yKGRheSwgbW9udGgsIHllYXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kYXkgPSBkYXk7XHJcbiAgICAgICAgdGhpcy5tb250aCA9IG1vbnRoO1xyXG4gICAgICAgIHRoaXMueWVhciA9IHllYXI7XHJcblxyXG4gICAgICAgIHRoaXMud2VlayA9IHRoaXMuZ2V0V2Vla0Zyb21EYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0V2Vla0Zyb21EYXRlKClcclxuICAgIHtcclxuICAgICAgICBsZXQgY3VycmVudERhdGUgPSBuZXcgRGF0ZSh0aGlzLnllYXIsIHRoaXMubW9udGgsIHRoaXMuZGF5LCBuZXcgRGF0ZSgpLmdldEhvdXJzKCksIG5ldyBEYXRlKCkuZ2V0TWludXRlcygpKTtcclxuICAgICAgICBsZXQgYmVnaW5uaW5nT2ZZZWFyID0gbmV3IERhdGUodGhpcy55ZWFyLCAwLCAxKTtcclxuICAgICAgICBsZXQgZGF5cyA9IE1hdGguZmxvb3IoKGN1cnJlbnREYXRlIC0gYmVnaW5uaW5nT2ZZZWFyKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHdlZWtOdW1iZXIgPSBNYXRoLmNlaWwoZGF5cyAvIDcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB3ZWVrTnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFN0cmluZ0Zyb21EYXRlKClcclxuICAgIHtcclxuICAgICAgICBsZXQgZGF5ID0gdGhpcy5kYXkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIik7XHJcbiAgICAgICAgbGV0IG1vbnRoID0gdGhpcy5tb250aC50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcclxuICAgICAgICByZXR1cm4gYCR7ZGF5fS4ke21vbnRofSAke3RoaXMueWVhcn1gO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBEYXRlTWFuYWdlclxyXG57XHJcbiAgICBzdGF0aWMgZ2V0VG9kYXlEYXRlKClcclxuICAgIHtcclxuICAgICAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDdXN0b21EYXRlKGRhdGUuZ2V0RGF0ZSgpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RnVsbFllYXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFRvZGF5V2VlaygpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VG9kYXlEYXRlKCkuZ2V0V2Vla0Zyb21EYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFyZURhdGVzRXF1YWwoZGF0ZTEsIGRhdGUyKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZGF0ZTEgfHwgIWRhdGUyKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIGRhdGUxLmRheSA9PT0gZGF0ZTIuZGF5ICYmIFxyXG4gICAgICAgICAgICAgICBkYXRlMS5tb250aCA9PT0gZGF0ZTIubW9udGggJiYgXHJcbiAgICAgICAgICAgICAgIGRhdGUxLnllYXIgPT09IGRhdGUyLnllYXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7RGF0ZU1hbmFnZXIsIEN1c3RvbURhdGV9OyIsImNsYXNzIERvbU1hbmFnZXJcclxue1xyXG4gICAgc3RhdGljIGNyZWF0ZU5hdkJ1dHRvbih0ZXh0KVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG4gICAgICAgIGxpLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgICBsaS5jbGFzc05hbWUgPSBcIm5hdi1idXR0b25cIjtcclxuICAgICAgICByZXR1cm4gbGk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNyZWF0ZVRvZG9JdGVtKG5hbWUpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7O1xyXG4gICAgICAgIGxpLmNsYXNzTmFtZSA9IFwidG9kby1pdGVtXCI7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lciA9IGNyZWF0ZVRvZG9CdXR0b25Db250YWluZXIoXCLinJNcIik7XHJcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQodG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9kb05hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRvZG9OYW1lLmNsYXNzTmFtZSA9IFwidG9kby1uYW1lXCI7XHJcbiAgICAgICAgdG9kb05hbWUudGV4dENvbnRlbnQgPSBuYW1lO1xyXG4gICAgICAgIGxpLmFwcGVuZENoaWxkKHRvZG9OYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9kb0RhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRvZG9EYXRlLmNsYXNzTmFtZSA9IFwidG9kby1kYXRlXCI7XHJcbiAgICAgICAgdG9kb0RhdGUudGV4dENvbnRlbnQgPSBcIk5vIGRhdGVcIjtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZCh0b2RvRGF0ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvZG9SZW1vdmVCdXR0b25Db250YWluZXIgPSBjcmVhdGVUb2RvQnV0dG9uQ29udGFpbmVyKFwiWFwiKTtcclxuICAgICAgICBsaS5hcHBlbmRDaGlsZCh0b2RvUmVtb3ZlQnV0dG9uQ29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtsaSwgdG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyLCB0b2RvUmVtb3ZlQnV0dG9uQ29udGFpbmVyfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlVG9kb0J1dHRvbkNvbnRhaW5lcihidXR0b25UZXh0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgdG9kb0J1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHRvZG9CdXR0b25Db250YWluZXIuY2xhc3NOYW1lID0gXCJ0b2RvLWJ1dHRvbi1jb250YWluZXJcIjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICAgIGJ0bi5jbGFzc05hbWUgPSBcInRvZG8tYnV0dG9uXCI7XHJcbiAgICAgICAgICAgIGJ0bi50YWJJbmRleCA9IC0xO1xyXG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBidXR0b25UZXh0O1xyXG4gICAgICAgICAgICB0b2RvQnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ0bik7XHJcbiAgICAgICAgICAgIHJldHVybiB0b2RvQnV0dG9uQ29udGFpbmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRG9tTWFuYWdlcjsiLCJpbXBvcnQgRG9tTWFuYWdlciBmcm9tIFwiLi9kb21cIjtcclxuaW1wb3J0IERhdGFNYW5hZ2VyIGZyb20gXCIuL3RvZG9zXCI7XHJcblxyXG5jbGFzcyBOYXZNYW5hZ2VyXHJcbntcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgaGVhZGluZywgdG9kb0xpc3QpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nID0gaGVhZGluZztcclxuICAgICAgICB0aGlzLnRvZG9MaXN0ID0gdG9kb0xpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEFsbFBhZ2UoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaGVhZGluZy50ZXh0Q29udGVudCA9IFwiQWxsIHRhc2tzXCI7XHJcbiAgICAgICAgdGhpcy50b2RvTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KERhdGFNYW5hZ2VyLmdldEFsbFRvZG9zKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KHRvZG9zKVxyXG4gICAge1xyXG4gICAgICAgIHRvZG9zLmZvckVhY2godG9kbyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtsaSwgdG9kb0NvbXBsZXRlQnV0dG9uQ29udGFpbmVyLCB0b2RvUmVtb3ZlQnV0dG9uQ29udGFpbmVyfSA9IERvbU1hbmFnZXIuY3JlYXRlVG9kb0l0ZW0odG9kby50aXRsZSk7XHJcbiAgICAgICAgICAgIHRvZG9Db21wbGV0ZUJ1dHRvbkNvbnRhaW5lci5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2RvTGlzdC5yZW1vdmVDaGlsZChsaSk7XHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5yZW1vdmVUb2RvKHRvZG8udGl0bGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRvZG9SZW1vdmVCdXR0b25Db250YWluZXIub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9kb0xpc3QucmVtb3ZlQ2hpbGQobGkpO1xyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIucmVtb3ZlVG9kbyh0b2RvLnRpdGxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRvZG9MaXN0LmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkVG9kYXlQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBcIlRvZGF5J3MgdGFza3NcIjtcclxuICAgICAgICB0aGlzLnRvZG9MaXN0LmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEFuZEFzc2lnblRvZG9zRnJvbUxpc3QoRGF0YU1hbmFnZXIuZ2V0VG9kb3NGcm9tVG9kYXkoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFdlZWtQYWdlKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmhlYWRpbmcudGV4dENvbnRlbnQgPSBcIlRoaXMgd2VlaydzIHRhc2tzXCI7XHJcbiAgICAgICAgdGhpcy50b2RvTGlzdC5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRBbmRBc3NpZ25Ub2Rvc0Zyb21MaXN0KERhdGFNYW5hZ2VyLmdldFRvZG9zRnJvbVRoaXNXZWVrKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRQcm9qZWN0UGFnZShuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaGVhZGluZy50ZXh0Q29udGVudCA9IGAke25hbWV9J3MgdG9kb3NgO1xyXG4gICAgICAgIHRoaXMudG9kb0xpc3QuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdk1hbmFnZXI7IiwiaW1wb3J0IHtEYXRlTWFuYWdlciwgQ3VzdG9tRGF0ZX0gZnJvbSBcIi4vZGF0ZU1hbmFnZXJcIjtcclxuXHJcbmNsYXNzIFRvZG8ge1xyXG4gICAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgcHJvamVjdClcclxuICAgIHtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XHJcbiAgICAgICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0ZSh2YWwpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kdWVEYXRlID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFByb2plY3QodmFsKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMucHJvamVjdCA9IHZhbDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgRGF0YU1hbmFnZXIge1xyXG4gICAgc3RhdGljIHRvZG9zID0gW107XHJcbiAgICBzdGF0aWMgcHJvamVjdHMgPSBbXTtcclxuXHJcbiAgICBzdGF0aWNcclxuICAgIHtcclxuICAgICAgICB0aGlzLmxvYWREYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWREYXRhKClcclxuICAgIHtcclxuICAgICAgICAvLyBMb2FkIGR1bW15IGRhdGEgZm9yIG5vd1xyXG4gICAgICAgIHRoaXMuY3JlYXRlVG9kbyhcIkdpbWxpMVwiLCBcIkEgZHdhcmYncyB0YXNrIDFcIiwgbmV3IEN1c3RvbURhdGUoMTcsIDYsIDIwMjMpLCAyLCBcIkR3YXJ2ZW4gU3R1ZmZcIik7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVUb2RvKFwiR2ltbGkyXCIsIFwiQSBkd2FyZidzIHRhc2sgMlwiLCBuZXcgQ3VzdG9tRGF0ZSgxOCwgNiwgMjAyMyksIDMsIFwiRHdhcnZlbiBTdHVmZlwiKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVRvZG8oXCJHaW1saTNcIiwgXCJBIGR3YXJmJ3MgdGFzayAzXCIsIG5ldyBDdXN0b21EYXRlKDI0LCA2LCAyMDIzKSwgNCwgXCJFbHZlbiBTdHVmZlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlUHJvamVjdChuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghbmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RzLmluY2x1ZGVzKG5hbWUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlByb2plY3QgYWxyZWFkeSBleGlzdHMhXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0cy5wdXNoKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiSW52YWxpZCBwcm9qZWN0IG5hbWUhXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0KVxyXG4gICAge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZG9zW2ldLnRpdGxlID09PSB0aXRsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJUYXNrIG5hbWUgbXVzdCBiZSB1bmlxdWUhXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdG9kbyA9IG5ldyBUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHByb2plY3QpO1xyXG4gICAgICAgIHRoaXMudG9kb3MucHVzaCh0b2RvKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0QWxsVG9kb3MoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvZG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2Rvc0Zyb21Ub2RheSgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHRvZGF5ID0gRGF0ZU1hbmFnZXIuZ2V0VG9kYXlEYXRlKCk7XHJcblxyXG4gICAgICAgIGxldCBvdXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9kb3MubGVuZ3RoOyBpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoRGF0ZU1hbmFnZXIuYXJlRGF0ZXNFcXVhbCh0b2RheSwgdGhpcy50b2Rvc1tpXS5kdWVEYXRlKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBvdXQucHVzaCh0aGlzLnRvZG9zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRUb2Rvc0Zyb21UaGlzV2VlaygpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHRvZGF5V2VlayA9IERhdGVNYW5hZ2VyLmdldFRvZGF5V2VlaygpO1xyXG5cclxuICAgICAgICBsZXQgb3V0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRvZG9zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codG9kYXlXZWVrKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy50b2Rvc1tpXS5kdWVEYXRlLndlZWspO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b2Rvc1tpXS5kdWVEYXRlLndlZWsgPT09IHRvZGF5V2VlaylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb3V0LnB1c2godGhpcy50b2Rvc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVtb3ZlVG9kbyhuYW1lKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50b2Rvcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZG9zW2ldLnRpdGxlID09PSBuYW1lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZG9zLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0YU1hbmFnZXI7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBEYXRlTWFuYWdlciB9IGZyb20gJy4vbW9kdWxlcy9kYXRlTWFuYWdlci5qcyc7XHJcbmltcG9ydCBEb21NYW5hZ2VyIGZyb20gJy4vbW9kdWxlcy9kb20uanMnO1xyXG5pbXBvcnQgTmF2TWFuYWdlciBmcm9tICcuL21vZHVsZXMvbmF2LmpzJztcclxuXHJcbi8vIERPTSBSZWZlcmVuY2VzXHJcbmNvbnN0IGFsbEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWxsLWJ1dHRvblwiKTtcclxuY29uc3QgdG9kYXlCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RvZGF5LWJ1dHRvblwiKTtcclxuY29uc3Qgd2Vla0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2Vlay1idXR0b25cIik7XHJcblxyXG5jb25zdCBhZGRQcm9qZWN0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZGQtcHJvamVjdC1idXR0b25cIik7XHJcblxyXG5jb25zdCBwcm9qZWN0c0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2plY3RzLWxpc3RcIik7XHJcblxyXG5jb25zdCBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWJvZHktY29udGFpbmVyXCIpO1xyXG5cclxuY29uc3QgbWFpbkhlYWRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1haW4tYm9keS1jb250YWluZXIgLnBhbmVsLWhlYWRpbmdcIik7XHJcbmNvbnN0IHRvZG9MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2RvLWxpc3RcIik7XHJcbmNvbnN0IGFkZFRhc2tCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FkZC10YXNrLWJ1dHRvblwiKTtcclxuXHJcbmNvbnN0IG5hdk1hbmFnZXIgPSBuZXcgTmF2TWFuYWdlcihtYWluQ29udGFpbmVyLCBtYWluSGVhZGluZywgdG9kb0xpc3QpO1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgbG9hZEFsbCgpO1xyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gbG9hZEFsbCgpXHJcbntcclxuICAgIG5hdk1hbmFnZXIubG9hZEFsbFBhZ2UoKTtcclxuXHJcbiAgICBhbGxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgdG9kYXlCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIHdlZWtCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICBhZGRUYXNrQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRUb2RheSgpXHJcbntcclxuICAgIG5hdk1hbmFnZXIubG9hZFRvZGF5UGFnZSgpO1xyXG5cclxuICAgIGFsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgdG9kYXlCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgd2Vla0J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgIGFkZFRhc2tCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkV2VlaygpXHJcbntcclxuICAgIG5hdk1hbmFnZXIubG9hZFdlZWtQYWdlKCk7XHJcblxyXG4gICAgYWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB0b2RheUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgd2Vla0J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gICAgYWRkVGFza0J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn1cclxuXHJcbmFsbEJ1dHRvbi5vbmNsaWNrID0gbG9hZEFsbDtcclxudG9kYXlCdXR0b24ub25jbGljayA9IGxvYWRUb2RheTtcclxud2Vla0J1dHRvbi5vbmNsaWNrID0gbG9hZFdlZWs7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9