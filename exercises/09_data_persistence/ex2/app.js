const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value;

    if(taskText === '') return;

    //TODO: 
    //1. get the tasks
    //2. push the new task to tasks, set done to false
    //3. save the tasks

    taskInput.value = '';
    renderTasks();
};

const getTasks = () => {
    //TODO:
    //1. read the tasks from localStorage
    //2. return the read tasks using JSON parse or an empty array if none were found
};

const saveTasks = tasks => {
    //TODO:
    //1. save the tasks in localstorage using JSON stringify
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
    //TODO:
    //1. empty local storage
    //2. update UI
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
