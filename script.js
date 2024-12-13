function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("task", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("task");
    const taskElement = document.getElementById(taskId);
    event.target.appendChild(taskElement);
    saveTasks();
}

document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;
    const taskDueDate = document.getElementById('task-due-date').value;
    const taskId = `task-${Date.now()}`;

    const taskElement = document.createElement('div');
    taskElement.classList.add('card', 'draggable', 'border-1');
    taskElement.setAttribute('id', taskId);
    taskElement.setAttribute('draggable', true);
    taskElement.setAttribute('ondragstart', 'drag(event)');

    taskElement.innerHTML = `
        <div class="card-body">
            <div class="task-controls">
                <h5 class="card-title">${taskName}</h5>
                <i class="fas fa-trash" onclick="deleteTask('${taskId}')"></i>
            </div>
            <p class="card-text">${taskDescription}</p>
            <p class="card-text"><small class="text-muted">Vencimento: ${taskDueDate}</small></p>
        </div>
    `;

    document.getElementById('pending-tasks').appendChild(taskElement);
    document.getElementById('task-name').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-due-date').value = '';

    saveTasks();
});

function deleteTask(taskId) {
    const taskElement = document.getElementById(taskId);
    taskElement.remove();
    saveTasks();
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || { pending: [], inProgress: [], completed: [] };

    tasks.pending.forEach(task => {
        createTaskElement(task.name, task.description, task.dueDate, 'pending', task.id);
    });
    tasks.inProgress.forEach(task => {
        createTaskElement(task.name, task.description, task.dueDate, 'inProgress', task.id);
    });
    tasks.completed.forEach(task => {
        createTaskElement(task.name, task.description, task.dueDate, 'completed', task.id);
    });
}

function createTaskElement(name, description, dueDate, status, id) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('card', 'draggable');
    taskElement.setAttribute('id', id);
    taskElement.setAttribute('draggable', true);
    taskElement.setAttribute('ondragstart', 'drag(event)');

    taskElement.innerHTML = `
        <div class="card-body">
            <div class="task-controls">
                <h5 class="card-title">${name}</h5>
                <i class="fas fa-trash" onclick="deleteTask('${id}')"></i>
            </div>
            <p class="card-text">${description}</p>
            <p class="card-text"><small class="text-muted">Vencimento: ${dueDate}</small></p>
        </div>
    `;

    document.getElementById(`${status}-tasks`).appendChild(taskElement);
}

function saveTasks() {
    const tasks = {
        pending: Array.from(document.getElementById('pending-tasks').children).map(task => ({
            name: task.querySelector('.card-title').textContent,
            description: task.querySelector('.card-text').textContent.split("\n")[0],
            dueDate: task.querySelector('.card-text small').textContent.split(": ")[1],
            id: task.id
        })),
        inProgress: Array.from(document.getElementById('in-progress-tasks').children).map(task => ({
            name: task.querySelector('.card-title').textContent,
            description: task.querySelector('.card-text').textContent.split("\n")[0],
            dueDate: task.querySelector('.card-text small').textContent.split(": ")[1],
            id: task.id
        })),
        completed: Array.from(document.getElementById('completed-tasks').children).map(task => ({
            name: task.querySelector('.card-title').textContent,
            description: task.querySelector('.card-text').textContent.split("\n")[0],
            dueDate: task.querySelector('.card-text small').textContent.split(": ")[1],
            id: task.id
        }))
    };

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

loadTasks();