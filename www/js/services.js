angular.module('starter.services', [])

.factory('Chats', function() {
  
  //Datos relativos a los datos de doctores en el chat
  var chats = [{
    id: 0,
    name: 'Doctor Francisco',
    lastText: 'Oncología',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Doctor Juan',
    lastText: 'Cardiología',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Doctor Manuel',
    lastText: 'Psiquiatría',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Enfermero Alvaro',
    lastText: 'Urgencias',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Doctor Mario',
    lastText: 'Urgencias',
    face: 'img/mike.png'
  }];


  /*Depende de lo que se necesite se puede implementar la funcion de eliminar elementos de la lista
  o simplemente devolver la lista */
  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
