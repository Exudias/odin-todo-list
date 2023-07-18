import DomManager from "./dom";
import DataManager from "./todos";

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
        let projects = DataManager.getAllProjects();
        this.projectList.innerHTML = "";
        this.projectButtons = [];
        projects.forEach(projectName => {
            let btn = DomManager.createNavButton(projectName);
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
                if (DataManager.getAllProjects().length > 1)
                {
                    DataManager.removeProject(projectName);
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
            this.loadAndAssignTodosFromList(DataManager.getAllTodos());
        }
        else if (this.currentPage === "Today")
        {
            this.loadAndAssignTodosFromList(DataManager.getTodosFromToday());
        }
        else if (this.currentPage === "Week")
        {
            this.loadAndAssignTodosFromList(DataManager.getTodosFromThisWeek());
        }
        else if (this.currentPage === "Project")
        {
            this.loadAndAssignTodosFromList(DataManager.getTodosFromProject(this.currentProject));
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
            const {li, todoCompleteButtonContainer} = DomManager.createTodoItem(todo.title, todo.description, todo.dueDate, todo.project);
            todoCompleteButtonContainer.onclick = () => {
                this.todoList.removeChild(li);
                DataManager.removeTodo(todo.title);
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
        DomManager.loadProjectPage();
    }
}

export default NavManager;