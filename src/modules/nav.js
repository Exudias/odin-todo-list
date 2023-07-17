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

        this.loadAndAssignTodosFromList(DataManager.getAllTodos());
    }

    loadAndAssignTodosFromList(todos)
    {
        todos.forEach(todo => {
            const {li, todoCompleteButtonContainer, todoRemoveButtonContainer} = DomManager.createTodoItem(todo.title);
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

    loadTodayPage()
    {
        this.heading.textContent = "Today's tasks";
        this.todoList.innerHTML = "";

        this.loadAndAssignTodosFromList(DataManager.getTodosFromToday());
    }

    loadWeekPage()
    {
        this.heading.textContent = "This week's tasks";
        this.todoList.innerHTML = "";

        this.loadAndAssignTodosFromList(DataManager.getTodosFromThisWeek());
    }

    loadProjectPage(name)
    {
        this.heading.textContent = `${name}'s todos`;
        this.todoList.innerHTML = "";

        
    }
}

export default NavManager;