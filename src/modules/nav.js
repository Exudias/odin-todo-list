import DomManager from "./dom";
import DataManager from "./todos";

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
        let projects = DataManager.getAllProjects();
        this.projectList.innerHTML = "";
        projects.forEach(projectName => {
            let btn = DomManager.createNavButton(projectName)
            this.projectList.appendChild(btn);
        });
    }

    loadTodos()
    {
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
            const {li, todoCompleteButtonContainer, todoRemoveButtonContainer} = DomManager.createTodoItem(todo.title, todo.dueDate);
            todoCompleteButtonContainer.onclick = () => {
                this.todoList.removeChild(li);
                DataManager.removeTodo(todo.title);
            }
            todoRemoveButtonContainer.onclick = () => {
                this.todoList.removeChild(li);
                DataManager.removeTodo(todo.title);
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

export default NavManager;