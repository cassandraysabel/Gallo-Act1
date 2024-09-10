const inputBox = document.getElementById('enter-task') as HTMLInputElement;
const dateTimeInput = document.getElementById('task-datetime') as HTMLInputElement;
const listContainer = document.getElementById('list-container');

interface Task {
    id: string;  
    task: string;
    addedAt: Date;
    dueDate: string;
    done: boolean;  
}

let tasks: Task[] = [];

function displayTask() {
    if (!inputBox || !dateTimeInput || !listContainer) return;

    if (inputBox.value === '' || dateTimeInput.value === '') {
        alert('Please enter a task / due');
    } else {
        const now = new Date();
        const newTask: Task = {
            id: now.getTime().toString(), 
            task: inputBox.value,
            addedAt: now,
            dueDate: dateTimeInput.value,
            done: false
        };

        tasks.push(newTask);
        createTaskElement(newTask);

        inputBox.value = '';
        dateTimeInput.value = '';
        saveData();
        sortTask(); 
    }
}


function createTaskElement(task: Task): void {
    const li = document.createElement("li");
    li.setAttribute('data-id', task.id); 

    const taskSpan = document.createElement("span");
    taskSpan.textContent = task.task;
    li.appendChild(taskSpan);

    const dateTimeSpan = document.createElement("span");
    dateTimeSpan.className = "date-time";
    const now = new Date();
    const taskDueDate = new Date(task.dueDate);
    
    if (taskDueDate < now) {
        dateTimeSpan.classList.add("expired");
    }
    dateTimeSpan.textContent = ` Due: ${task.dueDate}`;
    li.appendChild(dateTimeSpan);
    
    if (task.done) {
        li.classList.add("done");
    }
    
    const deleteSpan = document.createElement("span");
    deleteSpan.className = "delete";
    deleteSpan.textContent = " x";
    deleteSpan.onclick = function () {
        deleteTask(task.id);  
    };
    li.appendChild(deleteSpan);

    listContainer?.appendChild(li);
}


function deleteTask(taskId: string) {
    tasks = tasks.filter(task => task.id !== taskId);  

    
    const li = listContainer?.querySelector(`li[data-id="${taskId}"]`);
    if (li) {
        li.remove();
    }

    saveData();
}


listContainer?.addEventListener("click", function(e) {
    const target = e.target as HTMLElement;
    if (target.tagName === "SPAN" && !target.classList.contains("delete")) {
        const li = target.parentElement as HTMLLIElement;
        const taskId = li.getAttribute('data-id');
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.done = !task.done;  
            li.classList.toggle("done");
            sortTask();
            saveData();
        }
    }
}, false);


function sortTask() {
    const options = document.getElementById("sorting-options") as HTMLSelectElement;

    
    const unfinishedTasks = tasks.filter(task => !task.done);
    const finishedTasks = tasks.filter(task => task.done);    

    
    if (options.value === "default") {
        
        unfinishedTasks.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());
        finishedTasks.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());
    } else if (options.value === "date-due") {
        
        unfinishedTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        finishedTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }

    
    const sortedTasks = unfinishedTasks.concat(finishedTasks);

    
    listContainer!.innerHTML = '';
    sortedTasks.forEach(task => {
        createTaskElement(task);
    });
}


function saveData(): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function showTask(): void {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks).map((taskData: any) => ({
            ...taskData,
            addedAt: new Date(taskData.addedAt)  
        }));

        tasks.forEach(task => {
            createTaskElement(task);
        });

        sortTask(); 
    }
}


showTask();