var myBtn = document.getElementById('addNewTask');

//add event listener
myBtn.addEventListener('click', function(event) {
    console.log("addNewTask");
    
  /*
  var activity1 = new MozActivity({
    // The name of the activity the app wants to delegate the action
    name: "pick",

    // Data required by the activity. Each application acting as an activity handler 
    // can have it's own requirement for the activity. If the data does not fulfill
    // all the requirement of any activity handler, the error event will be sent
    // otherwise, the event sent depend on the activity handler itself.
    data: {
      type: "image/jpeg"
    }
  });

  activity1.onsuccess = function() {
    console.log("Activity successfuly handled");
    var imgSrc = this.result.blob;
  }
  activity1.onerror = function() {
    console.log("The activity encouter en error: " + this.error);
  }
  
  var sms = new MozActivity({
    name: "new", // Possible compose-sms in future versions
    data: {
      type: "websms/sms",
      number: "+46777888999"
    }
  });*/

});

window.addEventListener('load', function() {
  'use strict';
  
  navigator.mozSetMessageHandler('activity', function(activityRequest) {
  var option = activityRequest.source;

  if (option.name === "share") {
    // Do something to handle the activity
    console.log("received share action");
  }
});
  
  
  
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
