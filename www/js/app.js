// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
     // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
     // cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


// Funcion que intenta ocultar la barra de navegacion
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.hideTabs = true;
            $scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
})

//Configuracion de firebase e inicializacion de la misma
.config(function() {
  var config = {
    apiKey: "AIzaSyCy2hPEViouZaKnbIkArNzX9q_g50TkeoM",
    authDomain: "saludco-tablet.firebaseapp.com",
    databaseURL: "https://saludco-tablet.firebaseio.com",
    projectId: "saludco-tablet",
    storageBucket: "saludco-tablet.appspot.com",
    messagingSenderId: "1067659276507"
  };
  firebase.initializeApp(config);
})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  //Navegacion entre las distintas pantallas de la aplicacion
  .state('tab.dash', {
    url: '/dash',     //URL 
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html', //Fichero html a abrir
        controller: 'DashCtrl'  //Controller asociado a ese estado 
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'NotifCtrl'
      }
    }
  })
  
   .state('tab.select', {
    url: '/select',
    views: {
      'tab-select': {
        templateUrl: 'templates/tab-select.html',
        controller: 'selectCtrl'
      }
    }
  })
  .state('tab.select-detail', {
    url: '/select/:graficoId',
    views: {
      'tab-select': {
        templateUrl: 'templates/tab-ficha.html',
        controller: 'selectDetailCtrl'
      }
    }
  })

   .state('tab.agenda', {
    url: '/agenda',
    views: {
      'tab-agenda': {
        templateUrl: 'templates/tab-agenda.html',
        controller: 'agendaCtrl'
      }
    }
  })
  
  ;

  // Por defecto se va a esta vista
  $urlRouterProvider.otherwise('/tab/dash');

});
