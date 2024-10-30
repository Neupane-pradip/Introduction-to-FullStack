const { expect } = require('chai');
require('jsdom-global')();

const localStorageMock = (function() {
    let store = {};

    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
global.localStorage = localStorageMock;

describe('Todo List App using localStorage', function() {

    before(function() {
        document.body.innerHTML = `
            <input type="text" id="taskInput" placeholder="Add a new task">
            <button id="addButton">Add</button>
            <button id="clearButton">Clear</button>
            <ul id="taskList"></ul>
            <template id="itemTemplate">
                <li></li>
            </template>
        `;
        require('../app');
    });

    beforeEach(function() {
        localStorage.clear();
    });

    it('should add a new task', function() {
        const taskInput = document.getElementById('taskInput');
        const addButton = document.getElementById('addButton');
        taskInput.value = 'Test Task';
        addButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).to.exist;
        expect(tasks).to.be.an('array').that.is.not.empty;
        expect(tasks).to.have.lengthOf(1);
        expect(tasks[0].text).to.equal('Test Task');
        expect(tasks[0].done).to.be.false;

        const taskList = document.getElementById('taskList');
        const taskItem = taskList.querySelector('li');

        expect(taskItem).to.not.be.null;
        expect(taskItem.textContent).to.equal('Test Task');
        expect(taskItem.style.textDecoration).to.not.equal('line-through');
    });

    it('should mark a task as completed', function() {
        const taskInput = document.getElementById('taskInput');
        const addButton = document.getElementById('addButton');
        taskInput.value = 'Test Task';
        addButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).to.exist;
        expect(tasks).to.be.an('array').that.is.not.empty;
        expect(tasks).to.have.lengthOf(1);

        const taskList = document.getElementById('taskList');
        const taskItem = taskList.querySelector('li');

        expect(taskItem).to.not.be.null;

        taskItem.click();

        const tasksAgain = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksAgain[0].done).to.be.true;
    });

    it('should clear all tasks', function() {
        const taskInput = document.getElementById('taskInput');
        const addButton = document.getElementById('addButton');
        taskInput.value = 'Test Task';
        addButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).to.exist;
        expect(tasks).to.be.an('array').that.is.not.empty;
        expect(tasks).to.have.lengthOf(1);

        const clearButton = document.getElementById('clearButton');
        clearButton.click();

        const tasksAgain = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksAgain).to.be.null;
    });
});
