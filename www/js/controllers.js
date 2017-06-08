angular.module('starter.controllers', [])


//Controler del LogIn
.controller('DashCtrl', function($scope,$firebaseObject,$firebaseArray) {
   
   //Se hace la busqueda en firebase por la coleccion de usuarios
  var ref = firebase.database().ref();
  var usuariosRef = ref.child("usuarios");
  var data = $firebaseArray(usuariosRef);

  //Variables de control
  var presente = 0;
  var logs = 0;

 console.log();

 //Si se le da al boton de registro
  $scope.submit = function(username,password){

    //Se comprueba si el usuario ya estaba registrado
     usuariosRef.on('child_added',function(snapshot){
        console.log('child_added: ',snapshot.val().username);
        if(username == snapshot.val().username){
          console.log("wee");
          presente = 1;
        }
    });
    //En caso de estar registrado saldra una alerta diciendo que ya estas registrado
    //En caso de no estarlo se escribe tu nombre de usuario y contraseña en firebase
    console.log("pres",presente);
    if(presente == 0){
        data.$add({ 
          username: username,
          password: password
        }).then(function(ref) {
            alert('exito');
            window.location.assign(window.location.href.split("/tab")[0]+"/tab/account");
        });
    }else{
      alert("Ya estas registrado");
    }
  }

//Si se pulsa el boton de logIn
  $scope.logIn = function(username,password){

     usuariosRef.on('child_added',function(snapshot){
        console.log('user: ',snapshot.val().username);
           console.log('pas: ',snapshot.val().password);
           
          console.log('user2: ',username);
           console.log('pas2: ',password);
           
           //Se comprueba en la base de datos si el nombre de usuario y contraseña coinciden para alguna tupla {usuario, contraseña} en firebase
           //Si existe alguna coincidencia, saldra un alert diciendo que puedes entrar y te llevara a una vista de Home
           //Si no hay coincidencia el alert mostrara que el usuario o contrasela es erroneo
        if(username == snapshot.val().username && password == snapshot.val().password){
           alert('ENTRAS');
           window.location.assign(window.location.href.split("/tab")[0]+"/tab/account");
           logs = 1;
        }
    });
    console.log("log",logs);
    if(logs == 0){
       alert("Usuario o contraseña erroneos");
    }else{
      logs = 0;
    }
    
  }



})

//Controler del Login
.controller('ChatsCtrl', function($scope, Chats) {
  
  //Funcionalidad para borrar chats (funcionalidad finalmente no implenentada)
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

//Controler para cuando pulsa en algun chat concreto
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $firebaseObject,$firebaseArray ) {
  
  console.log(Chats.get());
  //$scope.chat = Chats.get($stateParams.chatId);

/*Se busca en firebase en la coleccion de chats
si pulsas el boton de enviar, en la base de datos se escribe el texto escrito en el cuadro de texto
*/

  var ref = firebase.database().ref();
  var usuariosRef = ref.child("chats");
  var data = $firebaseArray(usuariosRef);
 $scope.chats = data;
 
console.log("algo");
  $scope.sendChat = function(chat){
    console.log("weee");
      $scope.chats.$add({
        user: 'Usuario',
        message: chat.message

      });
      chat.message = "";
  }



})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})



/** Fabrica para tener la referencia al objeto en firebase */
.factory("ToDos", function($firebaseArray) {
  var toDosRef = firebase.database().ref().child("ToDos");
  return $firebaseArray(toDosRef);
})

//Controler para home
/** Controlador encargado de procesar las todos */

/*Controler que empieza con un template de carga mientras carga los datos de firebase 

Tiene funciones de actualizar la informacion, de borrar elementos de firebase, de añadir elementops afirebase,
y de actualizarlos (la parte de actualizacion no esta implementada)

*/

.controller("NotifCtrl", function($scope, ToDos, $ionicPopup, $ionicLoading) {

//Actualizar informacion
 $scope.doRefresh = function() {
  // Subtract from the value of the first item ID to get the new one.
  alert("Actualizando...");  
   $scope.$broadcast('scroll.refreshComplete');
 };

$scope.incidencias = [
   { id: "El Dr.Rodriguez no va a poder asistir a su cita a las 12:00, del 27 de Marzo." },
   { id: "Comunicado oficial: El pabellon H no estará disponible durante todo el mes por motivos de reforma y mantenimiento." },
   { id: "Las visitas según el nuevo horario, deberán realizarse de 11:00 am a 1:00 pm." },
   { id: "Comunicado oficial: Las jornadas de vacunación empezarán en breves semanas. "},
  ];
//Template de inicio en carga
  $ionicLoading.show({
    template: 'Cargando...'
  });

  /** Configuraciones para la lista */
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true

  /** Se obtiene la referencia al objeto que contiene los ToDos */
  $scope.toDos = ToDos;

//Si la llamada asincrona ha terminado, se esconde el template de carga
  $scope.toDos.$loaded().then(function (todo) {
      $ionicLoading.hide();
  });

  /** Funcion encargada de eliminar un ToDo */
  $scope.eliminar = function (item) {

    $scope.toDos.$remove(item).then(function(ref) {
      ref.key() === item.$id; // true
      console.log("ID: " + item.$id + " Fue eliminado");
    });

  }


  /** Funcion encargada de editar un ToDo */
  $scope.editar = function (toDo) {

    $scope.data = {
      "toDoEditado": toDo.name
    };

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.toDoEditado">',
        title: '¿Que vas a hacer?',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data.toDoEditado);
              if (!$scope.data.toDoEditado) {
                console.log("No ingreso nada");
               
                e.preventDefault();
              } else {
                console.log("Ingreso " +  $scope.data.toDoEditado);

                toDo.name = $scope.data.toDoEditado;

                $scope.toDos.$save(toDo).then(function(ref) {
                  ref.key() === toDo.$id; // true
                  console.log("Editado registro " + toDo.$id);
                });

                return $scope.data.toDoEditado;
              }
            }
          }
        ]
      });
  }

  /** Funcion encargada de Agregar un ToDo */
  $scope.agregar = function() {

    $scope.data = {};

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.toDoNuevo">',
        title: '¿Que vas a hacer?',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data.toDoNuevo);
              if (!$scope.data.toDoNuevo) {
                console.log("No ingreso nada");
           
                e.preventDefault();
              } else {
                console.log("Ingreso " +  $scope.data.toDoNuevo);

                 /** Se guada en firebase los datos recogidos del popup */
                $scope.toDos.$add({
                  "name": $scope.data.toDoNuevo
                });

                return $scope.data.toDoNuevo;
              }
            }
          }
        ]
      });

  };
})







/** Fabrica para tener la referencia al objeto en firebase en la coleccion de pacientes */
.factory("pacientes", function($firebaseArray) {
  var toDosRef = firebase.database().ref().child("pacientes");
  return $firebaseArray(toDosRef);
})

//Controler para los pacientes
/** Controlador encargado de procesar las todos */

/*Controler que empieza con un template de carga mientras carga los datos de firebase 

Tiene funciones de actualizar la informacion, de borrar elementos de firebase, de añadir elementops afirebase,
y de actualizarlos (la parte de actualizacion no esta implementada)

*/


/** Controlador encargado de procesar las todos */
.controller("selectCtrl", function($scope, pacientes, $ionicPopup, $ionicLoading) {

 $scope.doRefresh = function() {
  // Subtract from the value of the first item ID to get the new one.
  alert("Actualizando...");  
   $scope.$broadcast('scroll.refreshComplete');
 };

$scope.incidencias = [
   { id: "El Dr.Rodriguez no va a poder asistir a su cita a las 12:00, del 27 de Marzo." },
   { id: "Comunicado oficial: El pabellon H no estará disponible durante todo el mes por motivos de reforma y mantenimiento." },
   { id: "Las visitas según el nuevo horario, deberán realizarse de 11:00 am a 1:00 pm." },
   { id: "Comunicado oficial: Las jornadas de vacunación empezarán en breves semanas. "},
  ];
//Template de inicio en carga
  $ionicLoading.show({
    template: 'Cargando...'
  });

  /** Configuraciones para la lista */
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true
console.log(pacientes);
  /** Se obtiene la referencia al objeto que contiene los ToDos */
  $scope.pacientes = pacientes;

//Si la llamada asincrona ha terminado, se esconde el template de carga
  $scope.pacientes.$loaded().then(function (todo) {
      $ionicLoading.hide();
  });

  /** Funcion encargada de eliminar un paciente */
  $scope.eliminar = function (item) {

    $scope.pacientes.$remove(item).then(function(ref) {
      ref.key() === item.$id; // true
      console.log("ID: " + item.$id + " Fue eliminado");
    });

  }


  /** Funcion encargada de editar un paciente (no implementada)*/
  $scope.editar = function (toDo) {

    $scope.data = {
      "toDoEditado": toDo.name
    };
  
 var customTemplate =
      '<ion-toggle>enable</ion-toggle>' +
      '<label class="item item-input"><input type="text" placeholder="your address"></label>'+'<label class="item item-input"><input type="text" placeholder="your address"></label>';
      var myPopup = $ionicPopup.show({
        template: '<input type="password" ng-model="data.userPassword">   <br> Enter Confirm Password  <input type="password" ng-model="data.confirmPassword" > ',
        title: '¿Que va hacer?',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data.toDoEditado);
              if (!$scope.data.toDoEditado) {
                console.log("No ingreso nada");
             
                e.preventDefault();
              } else {
                console.log("Ingreso " +  $scope.data.toDoEditado);

                toDo.name = $scope.data.toDoEditado;
                console.log("aaa",toDo);
                $scope.pacientes.$save(toDo).then(function(ref) {
                  ref.key() === toDo.$id; // true
                  console.log("Editado registro " + toDo.$id);
                });

                return $scope.data.toDoEditado;
              }
            }
          }
        ]
      });
  }

  /** Funcion encargada de Agregar un paciente */
  $scope.agregar = function() {

//'<input type="text" ng-model="data.toDoNuevo">'

//El template del popup tiene los campos del customTemplate
    $scope.data = {};
var customTemplate =
     '<input type="text" placeholder="Nombre" ng-model="data.nombre">' + '</br>' +
    '<input type="text" placeholder="Num Seguridad Social" ng-model="data.ss">' + '</br>' +
    '<input type="text" placeholder="Edad" ng-model="data.edad">' + '</br>' +
    '<input type="text" placeholder="Diagnostico" ng-model="data.diag">' + '</br>' +
    '<input type="text" placeholder="Alergias" ng-model="data.alerg">' + '</br>' +
    '<input type="text" placeholder="Imagen" ng-model="data.imagen">' + '</br>' ;
   
      var myPopup = $ionicPopup.show({
        template: customTemplate,
        title: 'Inserta un nuevo Paciente',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data);
              if (!$scope.data) {
                console.log("No ingreso nada");
                
                e.preventDefault();
              } else {
                console.log("Ingreso " +  $scope.data.toDoNuevo);

                /** Se guada en firebase los datos recogidos del popup */
                $scope.pacientes.$add({
                  "timestap": Date.now(),
                  "nombre": $scope.data.nombre,
                  "ss": $scope.data.ss,
                  "edad": $scope.data.edad,
                  "diagnostico": $scope.data.diag,
                  "alergia": $scope.data.alerg,
                  "imagen": $scope.data.imagen
                });

                return $scope.data.toDoNuevo;
              }
            }
          }
        ]
      });

  };
})




/** Fabrica para tener la referencia al objeto en firebaseen la coleccion de pacientes*/
.factory("pacientesC", function($firebaseArray) {
  var toDosRef = firebase.database().ref().child("pacientes");
  return toDosRef;
})


/*Controler para cuando pulsas en el boton del nombre de un paciente*/

/*Busca en firebase el usuario al que estamos haceindo referencia y guarda en el scope la informacion relevate para poder ser mostrado en el visual*/

.controller('selectDetailCtrl', function($scope,$stateParams, pacientesC) {


pacientesC.on('child_added',function(snapshot){
        console.log('child_added: ',snapshot.val());
        if($stateParams.graficoId == snapshot.val().ss){
          $scope.name = snapshot.val().nombre;
        $scope.id = snapshot.val().ss;
         $scope.age = snapshot.val().edad;
        $scope.diagnostic = snapshot.val().diagnostico;
         $scope.allergies = snapshot.val().alergia;
        $scope.image = snapshot.val().imagen;
        }
    });

 
})


/** Fabrica para tener la referencia al objeto en firebase en la coleccion de agenda*/
.factory("agenda", function($firebaseArray) {
  var toDosRef = firebase.database().ref().child("agenda");
  return $firebaseArray(toDosRef);
})


/*Controler de la agenda*/
.controller('agendaCtrl', function($scope, agenda, $ionicPopup, $ionicLoading) {


 $scope.doRefresh = function() {
  // Subtract from the value of the first item ID to get the new one.
  alert("Actualizando...");  
   $scope.$broadcast('scroll.refreshComplete');
 };

$scope.incidencias = [
   { id: "El Dr.Rodriguez no va a poder asistir a su cita a las 12:00, del 27 de Marzo." },
   { id: "Comunicado oficial: El pabellon H no estará disponible durante todo el mes por motivos de reforma y mantenimiento." },
   { id: "Las visitas según el nuevo horario, deberán realizarse de 11:00 am a 1:00 pm." },
   { id: "Comunicado oficial: Las jornadas de vacunación empezarán en breves semanas. "},
  ];

  $ionicLoading.show({
    template: 'Cargando...'
  });

  /** Configuraciones para la lista */
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true
console.log(agenda);
  /** Se obtiene la referencia al objeto que contiene los eventos */
  $scope.agenda = agenda;

  $scope.agenda.$loaded().then(function (todo) {
      $ionicLoading.hide();
  });

  /** Funcion encargada de eliminar un evento */
  $scope.eliminar = function (item) {

    $scope.agenda.$remove(item).then(function(ref) {
      ref.key() === item.$id; // true
      console.log("ID: " + item.$id + " Fue eliminado");
    });

  }


  /** Funcion encargada de editar un evento */
  $scope.editar = function (toDo) {

    $scope.data = {
      "toDoEditado": toDo.name
    };
  
 var customTemplate =
      '<ion-toggle>enable</ion-toggle>' +
      '<label class="item item-input"><input type="text" placeholder="your address"></label>'+'<label class="item item-input"><input type="text" placeholder="your address"></label>';
      var myPopup = $ionicPopup.show({
        template: '<input type="password" ng-model="data.userPassword">   <br> Enter Confirm Password  <input type="password" ng-model="data.confirmPassword" > ',
        title: '¿Que va hacer?',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data.toDoEditado);
              if (!$scope.data.toDoEditado) {
                console.log("No ingreso nada");
               
                e.preventDefault();
              } else {
                console.log("Ingreso " +  $scope.data.toDoEditado);

                toDo.name = $scope.data.toDoEditado;
                console.log("aaa",toDo);
                $scope.agenda.$save(toDo).then(function(ref) {
                  ref.key() === toDo.$id; // true
                  console.log("Editado registro " + toDo.$id);
                });

                return $scope.data.toDoEditado;
              }
            }
          }
        ]
      });
  }

  /** Funcion encargada de Agregar un evento */
  $scope.agregar = function() {

//'<input type="text" ng-model="data.toDoNuevo">'
//El template del popup tiene los campos del customTemplate
    $scope.data = {};
var customTemplate =
     '<input type="text" placeholder="Descripcion de la cita" ng-model="data.descripcion">' + '</br>' +
    '<input type="text" placeholder="Fecha(dd/mm/yy)" ng-model="data.fecha">' + '</br>' +
    '<input type="text" placeholder="Hora(HH:MM)" ng-model="data.hora">' + '</br>';
   
      var myPopup = $ionicPopup.show({
        template: customTemplate,
        title: 'Inserta una nueva cita',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data);
              if (!$scope.data) {
                console.log("No ingreso nada");
                
                e.preventDefault();
              } else {
                console.log("Ingreso " +  $scope.data);

                   /** Se guada en firebase los datos recogidos del popup */
                $scope.agenda.$add({
                  
                  "descripcion": $scope.data.descripcion,
                  "fecha": $scope.data.fecha,
                  "hora": $scope.data.hora,
                
                });

                return $scope.data.toDoNuevo;
              }
            }
          }
        ]
      });

  };



/*Funciones para generar el calendario*/

/*Listas necesarias para construir la informacion de los meses y los dias de la semana*/

 var mesos = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
];

var dies = [
    'Diumenge',
    'Dilluns',
    'Dimarts',
    'Dimecres',
    'Dijous',
    'Divendres',
    'Dissabte'
];

var dies_abr = [
    'D',
    'L',
    'M',
    'X',
    'J',
    'V',
    'S'
   
];

/*Funciones necesarias para generar el calendario*/

Number.prototype.pad = function(num) {
    var str = '';
    for(var i = 0; i < (num-this.toString().length); i++)
        str += '0';
    return str += this.toString();
}

/*Funcion que "pinta el calendario"*/

function calendari(widget, data)
{
    /*variable que indica la existencia del calendario*/
    var original = widget.getElementsByClassName('actiu')[0];

    /*Si el calendario no ha sido construido se genera utilizando metodos para obtener el dia actual, el mes y el año actual*/
    if(typeof original === 'undefined')
    {
        original = document.createElement('table');
        original.setAttribute('data-actual',
			      data.getFullYear() + '/' +
			      data.getMonth().pad(2) + '/' +
			      data.getDate().pad(2))
        widget.appendChild(original);
    }

    //Se realizan calculos para mantener la coherencia del calendario en todo momento
    var diff = data - new Date(original.getAttribute('data-actual'));

    diff = new Date(diff).getMonth();

    var e = document.createElement('table');

    e.className = diff  === 0 ? 'amagat-esquerra' : 'amagat-dreta';
    e.innerHTML = '';

    widget.appendChild(e);

    e.setAttribute('data-actual',
                   data.getFullYear() + '/' +
                   data.getMonth().pad(2) + '/' +
                   data.getDate().pad(2))


    //Se generan las filas enlas que estaran el nombre del mes, las siglas de los dias de la semana y los numeros de los dias*/
    var fila = document.createElement('tr');
    var titol = document.createElement('th');
    titol.setAttribute('colspan', 7);

    /*Se generan los botones para poder navegar entre meses*/
    var boto_prev = document.createElement('button');
    boto_prev.className = 'boto-prev';
    boto_prev.innerHTML = '&#9666;';

    var boto_next = document.createElement('button');
    boto_next.className = 'boto-next';
    boto_next.innerHTML = '&#9656;';

    /*Se configuran las filas para generar el calendario*/
    titol.appendChild(boto_prev);
    titol.appendChild(document.createElement('span')).innerHTML = 
        mesos[data.getMonth()] + '<span class="any">' + data.getFullYear() + '</span>';

    titol.appendChild(boto_next);
    /*Si presiona el boton de la izquierda nos movemos a un mes antes, si pulsa el de la izquierda se movera al mes siguiente*/
    boto_prev.onclick = function() {
        data.setMonth(data.getMonth() - 1);
        calendari(widget, data);
    };

    boto_next.onclick = function() {
        data.setMonth(data.getMonth() + 1);
        calendari(widget, data);
    };

    fila.appendChild(titol);
    e.appendChild(fila);

    /*Se escriben las siglas de los dias de la semana*/
    fila = document.createElement('tr');

    for(var i = 1; i < 7; i++)
    {
        fila.innerHTML += '<th>' + dies_abr[i] + '</th>';
    }

    fila.innerHTML += '<th>' + dies_abr[0] + '</th>';
    e.appendChild(fila);

    /* obtiene el dia que va acabar el mes anterior */
    var inici_mes =
        new Date(data.getFullYear(), data.getMonth(), -1).getDay();

    var actual = new Date(data.getFullYear(),
			  data.getMonth(),
			  -inici_mes);

    /* Se escriben  6 semanas por vista*/
    for(var s = 0; s < 6; s++)
    {
        var fila = document.createElement('tr');

        /*Se van escribiendo los dias (numero)*/
        for(var d = 1; d < 8; d++)
        {
	    var cela = document.createElement('td');
	    var span = document.createElement('span');

	    cela.appendChild(span);

            span.innerHTML = actual.getDate();

            if(actual.getMonth() !== data.getMonth())
                cela.className = 'fora';

            /* Si es el dia actual, se remarca */
            if(data.getDate() == actual.getDate() &&
	       data.getMonth() == actual.getMonth())
		cela.className = 'avui';

	    actual.setDate(actual.getDate()+1);
            fila.appendChild(cela);
        }

        e.appendChild(fila);
    }

    setTimeout(function() {
        e.className = 'actiu';
        original.className +=
        diff === 0 ? ' amagat-dreta' : ' amagat-esquerra';
    }, 20);

    original.className = 'inactiu';

    setTimeout(function() {
        var inactius = document.getElementsByClassName('inactiu');
        for(var i = 0; i < inactius.length; i++)
            widget.removeChild(inactius[i]);
    }, 1000);

}
//Se genera el calendario
calendari(document.getElementById('calendari'), new Date());

 
})

;


