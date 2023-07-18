import {DateManager, CustomDate} from "./dateManager";
import DomManager from "./dom";

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
        DomManager.resetTaskProject();
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

        if (!(dueDate instanceof CustomDate))
        {
            dueDate = CustomDate.createFromDateObject(dueDate);
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
        let today = DateManager.getTodayDate();

        let out = [];
        for (let i = 0; i < this.todos.length; i++)
        {
            if (DateManager.areDatesEqual(today, this.todos[i].dueDate))
            {
                
                out.push(this.todos[i]);
            }
        }
        return out;
    }

    static getTodosFromThisWeek()
    {
        let todayWeek = DateManager.getTodayWeek();

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
        DomManager.resetTaskProject();
    }
}

export default DataManager;