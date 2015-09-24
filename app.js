window.addEventListener('load', function() {
  'use strict';

  window.taskAPI = (() => {
    var tasks = [];

    function getAllTasks() {
        // TODO defeensively copy tasks
      return Promise.resolve(tasks);
    }

    function addTask(description) {
      var task = {description};
      tasks.push(task);
      return Promise.resolve({id: (tasks.length - 1), task: task});
    }

    function deleteTasks(taskIds) {
      var removedIds = []
      taskIds.sort();
      for(var i = taskIds.length; i--;) {
        var id = taskIds[i];
        if (id < tasks.length) {
          tasks.splice(id, 1);
          removedIds.push(id);
        }
      }
      return Promise.resolve(removedIds);
    }

    return {
      getAll: getAllTasks,
      add: addTask,
      deleteTasks: deleteTasks
    };
  })();

  window.taskUI = (() => {
    var taskList = document.getElementById('tasklist');
    var dialog = document.querySelector('.addDialog');
    var deleteButton = document.querySelector('menu a[href="#delete"]');
    var editButton = document.querySelector('menu a[href="#edit"]');
    var addButton = document.querySelector('menu a[href="#add"]');

    function appendTask(task, id) {

      var htmlTask = document.createElement('li');
      // TODO sanitize user input
      htmlTask.innerHTML =
        ` <label class="pack-checkbox">
            <input type="checkbox" value="${id}">
            <span></span>
          </label><p>${task.description}</p>`;
      taskList.appendChild(htmlTask);
    }

    function refreshAllTask(tasks) {
      taskList.innerHTML = '';

      for (var i = 0; i < tasks.length; i++) {
        appendTask(tasks[i], i);
      }
    }

    function showAddDialog() {
      var descInput = dialog.querySelector('input[name="description"]');
      descInput.value = '';
      descInput.focus();
      dialog.classList.add('active');
      dialog.classList.remove('inactive');
    }

    function hideAddDialog() {
      dialog.classList.remove('active');
      dialog.classList.add('inactive');
    }

    function goEditMode() {
      taskList.setAttribute('data-type', 'edit');
      editButton.style.display = 'none';
      addButton.style.display = 'none';
      deleteButton.style.display = '';
    }

    function leaveEditMode() {
      taskList.setAttribute('data-type', '');
      editButton.style.display = '';
      addButton.style.display = '';
      deleteButton.style.display = 'none';
    }

    return {
      append: appendTask,
      refresh: refreshAllTask,
      showAddDialog: showAddDialog,
      hideAddDialog: hideAddDialog,
      goEditMode: goEditMode,
      leaveEditMode: leaveEditMode
    }
  })();

  document.querySelector('a[href="#add"]').addEventListener('click', (e)=> {
    taskUI.showAddDialog();
  });

  document.querySelector('.addDialog a.close').addEventListener('click', (e) => {
    taskUI.hideAddDialog();
  })

  document.querySelector('a[href="#edit"]').addEventListener('click', (e)=> {
    e.preventDefault();
    taskUI.goEditMode();
  });

  document.querySelector('a[href="#delete"]').addEventListener('click', (e)=> {
    // TODO delete element
    e.preventDefault();
    var checkedElms = document
      .querySelectorAll('ul[data-type="edit"] input[type="checkbox"]:checked');
    var indexToDelete = [];
    for (var checkbox of checkedElms) {
      indexToDelete.push(checkbox.value);
    }
    taskAPI.deleteTasks(indexToDelete)
    .then(taskAPI.getAll)
    .then(taskUI.refresh);
    taskUI.leaveEditMode();
  });

  document.querySelector('.addDialog form')
  .addEventListener('submit', (e) => {
    e.preventDefault();
    var desc = document.querySelector('.addDialog input[name="description"]');
    taskAPI.add(desc.value).then((v) => {
      taskUI.append(v.task, v.id);
    });
    taskUI.hideAddDialog();

  });

  taskAPI.getAll().then(taskUI.refresh);
});
