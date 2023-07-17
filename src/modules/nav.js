import DomManager from "./dom";
import DataManager from "./todos";

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

        const todos = DataManager.getAllTodos();
        todos.forEach(todo => {
            const {li, complete, remove} = DomManager.createTodoItem(todo.title);
            this.todoList.appendChild(li);
        });
    }

    loadTodayPage()
    {
        this.heading.textContent = "Today's tasks";
        this.todoList.innerHTML = "";
    }

    loadWeekPage()
    {
        this.heading.textContent = "This week's tasks";
        this.todoList.innerHTML = "";
    }

    loadProjectPage(name)
    {
        this.heading.textContent = `${name}'s todos`;
        this.todoList.innerHTML = "";
    }
}

export default NavManager;