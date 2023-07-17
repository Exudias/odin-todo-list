import DateManager from "./dateManager";

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
    todos = [];
    projects = [];

    constructor(projects, todos)
    {
        if (!projects)
        {
            this.projects = projects;
        }
        if (!todos)
        {
            this.todos = todos;
        }
    }

    createProject(name)
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

    createTodo(title, description, dueDate, priority, project)
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

    getTodosFromToday()
    {

    }

    getTodosFromThisWeek()
    {

    }
}

export default DataManager;