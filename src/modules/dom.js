import DataManager from "./todos";
import NavManager from "./nav";
import { CustomDate } from "./dateManager";

class DomManager
{
    static openOverlay = null;

    static 
    {
        this.loadDOMReferences();

        this.navManager = new NavManager(this.mainContainer, this.mainHeading, this.todoList, this.projectsList);
        
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
        let projects = DataManager.getAllProjects();
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
        
                DataManager.createTodo(formValues.title, formValues.description, new Date(formValues.date), formValues.priority, formValues.project);
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
        
                DataManager.createProject(formValues.title);
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
        todoDate.textContent = CustomDate.getStringFromDate(date);
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

export default DomManager;