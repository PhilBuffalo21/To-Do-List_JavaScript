const myTitle = document.querySelector(".Title");
myTitle.textContent = 'To-Do List';

const myAddButton = document.querySelector("#Add");
myAddButton.textContent = 'Add Task';

const myInput = document.querySelector('#Task');


const myList = document.querySelector('ul');

const dbname = 'TodoDB';
const dbversion = 2; 
let db;
const request = indexedDB.open(dbname, dbversion);

request.onerror = () => {
    console.log(`Database Error: ${request.errorCode}`)
};

request.onupgradeneeded = () => {
    db = request.result;
    const objectStore = db.createObjectStore('todos', {keyPath: 'id', autoIncrement: true});
    objectStore.createIndex('task', 'task', {unique: false});
    console.log('Database upgraded succuessfully');
};

request.onsuccess = () => {
    db = request.result;
};

function deleteTask(id) {
    const transaction = db.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.delete(id);

    request.onsuccess = () => {
        console.log('Task deleted');
    }
    request.onerror = () => {
        console.log('Failed to delete task');
    }
};

function addTodo(task){
    const transaction = db.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');

    const request = objectStore.put({task: task});
    request.onsuccess = () => {
        console.log('Task added successfully');
    };

    request.onerror = () => {
        console.log('Error task failed to be added');
    };
}

function getAll(){
    const transcation = db.transaction(['todos'], 'readonly');
    const objectStore = transcation.objectStore('todos');
    
    const request = objectStore.getAll();

    request.onerror = () => {
        const todos = request.result; 
        todos.array.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.task;
            myList.appendChild(li);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'Delete';
            li.addEventListener(deleteButton);

            deleteButton.onclick = () => {
                deleteTask(todo.id);
                myList.removeChild(li);
            };
        });
    };
}

myAddButton.onclick = () => {
    const task = myInput.value.trim();
    if(task != null){
        const li = document.createElement('li');
        li.textContent = task; 
        myList.appendChild(li);

        // delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        li.appendChild(deleteButton);
        
        addTodo(task);

        deleteButton.onclick = () => {
            deleteTodo(todo.id);
            myList.removeChild(li);
        };
        
        myInput.value = ''; // This line clears the input field

            console.log('Added successfully.');
    }
    else{
        console.log('The input field is empty.');
    }
};
