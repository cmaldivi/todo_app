window.addEventListener('load', function() {
  'use strict';

var request = navigator.mozApps.install("http://cmaldivi.github.io/todo_app/manifest.webapp")
request.onsuccess = function () {
  // Enregistre l'objet App qui est renvoyé
  var appRecord = this.result;
  alert('Installation réussie !');
};
request.onerror = function () {
  // Affiche le nom de l'erreur depuis l'objet DOMError
  alert('Installation échouée, erreur : ' + this.error.name);
};
