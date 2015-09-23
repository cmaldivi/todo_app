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
      return Promise.resolve(task);
    }

    return {
      getAll: getAllTasks,
      add: addTask
    };
  })();

  window.taskUI = (() => {
    var taskList = document.getElementById('tasklist');
    var dialog = document.querySelector('.addDialog');

    function appendTask(task) {

      var htmlTask = document.createElement('li');
      // TODO sanitize user input
      htmlTask.innerHTML =
        ` <label class="pack-checkbox">
            <input type="checkbox">
            <span></span>
          </label><p>${task.description}</p>`;
      taskList.appendChild(htmlTask);
    }

    function refreshAllTask(tasks) {
      refreshAll: (tasks) => {
        taskList.innerHTML = '';

        for (task of tasks) {
          appendTask(task);
        }
      }
    }

    function showAddDialog() {
      dialog.querySelector('input[name="description"]').value = '';
      dialog.classList.add('active');
      dialog.classList.remove('inactive');
    }

    function hideAddDialog() {
      dialog.classList.remove('active');
      dialog.classList.add('inactive');
    }

    function goEditMode() {
      taskList.setAttribute('data-type', 'edit');
      window.location.hash = '';
    }

    function leaveEditMode() {
      taskList.setAttribute('data-type', '');
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

  //document.querySelector('.actionRemove').addEventListener('click', (e)=> {
    //e.preventDefault();
    //taskUI.goEditMode();
  //});

  document.querySelector('.addDialog > form button[type="submit"]')
  .addEventListener('click', (e) => {
    e.preventDefault();
    var desc = document.querySelector('.addDialog input[name="description"]');
    taskAPI.add(desc.value).then(taskUI.append);
    taskUI.hideAddDialog();

  });

  taskAPI.getAll().then(taskUI.refresh);
});
