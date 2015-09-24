window.addEventListener('load', function() {
  'use strict';

navigator.mozApps.install("http://cmaldivi.github.io/todo_app/manifest.webapp")
    .onSuccess() {
      console.log("install ok");
    }
    .onError() {
      console.log("install error");
    };

});
