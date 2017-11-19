
var routerApp = angular.module('routerApp', ['ui.router',]);

routerApp.controller('scotchController', myFun);

function myFun($scope,$state,InboxService,getBodyText) {

     $scope.paraBody = getBodyText;
  
    $scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];
    
    $scope.goParaBody = function(){
      InboxService.getMessages()
       $state.go('.body',{ someData: 25 } )
    }

}
routerApp.factory('InboxService', InboxService);

function InboxService($http) {

  function getMessages() {
    return $http.get('https://jsonplaceholder.typicode.com/posts/1').then(function (response) {
      return response.data;
    });
  }
  return {
    getMessages: getMessages
  };
  
}

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'partial-home.html'
        })
        // nested list with custom controller
        .state('home.list', {
            url: '/list',
            templateUrl: 'partial-home-list.html',
            controller: function($scope) {
                $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
            }
        })
    
        // nested list with just some random string data
        .state('home.paragraph', {
            url: '/paragraph',
             templateUrl: 'partial.home.paragraph',
              controller:'scotchController',
               resolve: {
                getBodyText: function (InboxService) {
                    return InboxService.getMessages();
                }
               }
        })
        
        .state('home.paragraph.body', {
            url: '/body/{someData:string}',
            templateUrl: 'partial.home.paragraph.body'
           
    
           
        })


        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
        url: '/about',
        views: {

            // the main template will be placed here (relatively named)
            '': { templateUrl: 'partial-about.html' },

            // the child views will be defined here (absolutely named)
            'columnOne@about': { template: 'Look I am a column!' },

            // for column two, we'll define a separate controller 
            'columnTwo@about': { 
                templateUrl: 'table-data.html',
                controller: 'scotchController'
                
            }
        }

    });

});