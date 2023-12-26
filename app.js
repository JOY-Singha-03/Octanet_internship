document.addEventListener("DOMContentLoaded", function() {
    const todoForm = document.getElementById("todoForm");
    const taskInput = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDate");
    const taskList = document.getElementById("taskList");
  
    loadTasks();
  
    todoForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const taskContent = taskInput.value.trim();
      const dueDate = dueDateInput.value;
  
      if (taskContent !== "") {
        createTask(taskContent, dueDate);
        saveTaskToLocalStorage(taskContent, dueDate);
        taskInput.value = "";
        dueDateInput.value = "";
      } else {
        alert("Please enter a task!");
      }
    });
  
    taskList.addEventListener("dblclick", function(event) {
      const taskItem = event.target;
      if (taskItem.tagName.toLowerCase() === "li") {
        const content = taskItem.innerText.split(' - Due: ')[0];
        const dueDate = taskItem.innerText.split(' - Due: ')[1] || '';
  
        const newContent = prompt("Edit task:", content);
        if (newContent !== null) {
          taskItem.innerText = newContent + (dueDate ? ` - Due: ${dueDate}` : '');
          updateLocalStorage();
        }
      }
    });
  
    const filterCompleted = document.getElementById("filterCompleted");
    filterCompleted.addEventListener("change", function() {
      const completedTasks = document.querySelectorAll(".completed");
      const incompleteTasks = document.querySelectorAll("li:not(.completed)");
  
      if (this.checked) {
        incompleteTasks.forEach(task => task.style.display = 'none');
        completedTasks.forEach(task => task.style.display = '');
      } else {
        incompleteTasks.forEach(task => task.style.display = '');
        completedTasks.forEach(task => task.style.display = 'none');
      }
    });
  
    const clearAllBtn = document.getElementById("clearAll");
    clearAllBtn.addEventListener("click", function() {
      if (confirm("Are you sure you want to clear all tasks?")) {
        taskList.innerHTML = "";
        localStorage.removeItem("tasks");
      }
    });
  
    function createTask(content, dueDate) {
      const taskItem = document.createElement("li");
      taskItem.innerText = content + (dueDate ? ` - Due: ${dueDate}` : '');
  
      const completeButton = document.createElement("button");
      completeButton.innerText = "Complete";
      completeButton.classList.add("complete-btn");
      taskItem.appendChild(completeButton);
  
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("delete-btn");
      deleteButton.style.backgroundColor = "red";
      taskItem.appendChild(deleteButton);
  
      taskList.appendChild(taskItem);
  
      completeButton.addEventListener("click", function() {
        taskItem.classList.toggle("completed");
        updateLocalStorage();
      });
  
      deleteButton.addEventListener("click", function() {
        taskList.removeChild(taskItem);
        updateLocalStorage();
      });
    }
  
    function saveTaskToLocalStorage(content, dueDate) {
      let tasks;
      if (localStorage.getItem("tasks") === null) {
        tasks = [];
      } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
      }
      tasks.push({ content, dueDate });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function loadTasks() {
      if (localStorage.getItem("tasks") !== null) {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks.forEach(function(task) {
          createTask(task.content, task.dueDate);
        });
      }
    }
  
    function updateLocalStorage() {
      const tasks = [];
      document.querySelectorAll("#taskList li").forEach(function(task) {
        const taskContent = task.innerText.split(' - Due: ');
        const content = taskContent[0];
        const dueDate = taskContent[1];
        tasks.push({ content, dueDate });
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });
  