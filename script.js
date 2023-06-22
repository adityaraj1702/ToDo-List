// Get elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];

// Create an array to store tasks
let tasks = [];

// Function to add a task
function addTask() {
  const task = taskInput.value;
  if (task !== '') {
    tasks.unshift(task);
    renderTasks();
    taskInput.value = '';
    saveTasks();
  }
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Function to load tasks from local storage
  function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
      renderTasks();
    }
  }
// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

// Function to render tasks in the table
function renderTasks() {
  // Clear table body
  taskTable.innerHTML = '';

  // Loop through tasks array
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    // Create table row and cells
    const row = document.createElement('tr');
    row.dataset.index = i; // Set dataset index for reordering
    const taskCell = document.createElement('td');
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');

    // Set task content and delete button properties
    taskCell.textContent = task;
    deleteButton.textContent = 'Done';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteTask(i));

    // Add random colorful border to the task cell
    const randomColor = getRandomColor();
    taskCell.style.border = `2px solid ${randomColor}`;

    // Add drag and drop functionality
    row.draggable = true;
    row.addEventListener('dragstart', dragStart);
    row.addEventListener('dragover', dragOver);
    row.addEventListener('dragend', dragEnd);

    // Append cells to the row
    deleteCell.appendChild(deleteButton);
    row.appendChild(taskCell);
    row.appendChild(deleteCell);

    // Append row to the table
    taskTable.appendChild(row);
  }
}

// Function to delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks();
}

// Function to handle drag start event
function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.innerHTML);
  e.target.classList.add('dragging');
}

// Function to handle drag over event
function dragOver(e) {
  e.preventDefault();
  const targetRow = e.target.closest('tr');
  const draggingRow = document.querySelector('.dragging');
  if (targetRow !== draggingRow) {
    taskTable.insertBefore(draggingRow, targetRow);
  }
}

// Function to handle drag end event
function dragEnd(e) {
  e.target.parentNode.classList.remove('drag-over');

  const targetIndex = parseInt(e.target.parentNode.dataset.index);
  const isLastRow = targetIndex === tasks.length - 1;

  if (isLastRow && draggedIndex !== null) {
    const taskToMove = tasks[draggedIndex];
    tasks.splice(draggedIndex, 1);
    tasks.splice(targetIndex, 0, taskToMove);
    renderTasks();
    saveTasks();
  }

  draggedIndex = null;
}

// Function to update the tasks array after reordering
function updateTasksOrder() {
  const updatedTasks = [];
  const rows = taskTable.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    const task = rows[i].getElementsByTagName('td')[0].textContent;
    updatedTasks.push(task);
  }
  tasks = updatedTasks;
  saveTasks();
}

// Event listener for adding a task
addTaskButton.addEventListener('click', addTask);
window.addEventListener('load', loadTasks);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Render initial tasks
renderTasks();
