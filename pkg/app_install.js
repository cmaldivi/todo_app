window.addEventListener('load', function() {
  'use strict';

var request = navigator.mozApps.installPackage("https://cmaldivi.github.io/todo_app/pkg/manifest.webapp")
request.onsuccess = function () {
  // Enregistre l'objet App qui est renvoyé
  var appRecord = this.result;
  alert('Installation réussie for packaged !');
};
request.onerror = function () {
  // Affiche le nom de l'erreur depuis l'objet DOMError
  alert('Installation échouée, erreur : ' + this.error.name);
};
});
