const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value;

    if(taskText === '') return;

    const tasks = getTasks();
    tasks.push({ text: taskText, done: false });
    saveTasks(tasks);

    taskInput.value = '';
    renderTasks();
};

const getTasks = () => {
    const tasksJson = localStorage.getItem('tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
};

const saveTasks = tasks => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const renderTasks = () => {
    const tasks = getTasks();
    const taskList = document.getElementById('taskList');
    const template = document.getElementById('itemTemplate');
    const clearButton = document.getElementById('clearButton');
    clearButton.style.display = (tasks && tasks.length > 0) ? 'block' : 'none';
    taskList.innerHTML = '';
    tasks && tasks.forEach((task, index) => {
        const clone = template.content.cloneNode(true);
        const liElement = clone.querySelector('li');
        liElement.textContent = task.text;
        if(task.done) {
            liElement.style.textDecoration = 'line-through';
        }
        liElement.addEventListener('click', () => toggleTaskDone(index));
        taskList.appendChild(liElement);
    });
};

const clearList = () => {
    localStorage.clear();
    renderTasks();
};

const toggleTaskDone = index => {
    const tasks = getTasks();
    tasks[index].done = !tasks[index].done;
    saveTasks(tasks);
    renderTasks();
};

(() => {
    const addButton = document.getElementById('addButton');
    const clearButton = document.getElementById('clearButton');
    addButton.addEventListener('click', () => addTask());
    clearButton.addEventListener('click', () => clearList());
    renderTasks();
})();