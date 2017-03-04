angular
    .module('ttt', ["ui.router","ngStorage"])
    .config( function ($locationProvider, $urlMatcherFactoryProvider, $stateProvider, $urlRouterProvider ) {
        
        $locationProvider.html5Mode(true);  
        $urlMatcherFactoryProvider.caseInsensitive(true);      
        $urlRouterProvider.otherwise("Login");
        $stateProvider
            .state("Login", {
                url: "/Login",
                views: {
                    "login": {
                        templateUrl: "views/loginView.html",
                        controller: "loginController",
                        controllerAs: "loginCtrl"
                    }
                }
            })
            .state("Menu", {
                url: "/Menu",
                views: {
                    "menu": {
                        templateUrl: "views/menuView.html",
                        controller: "menuController",
                        controllerAs: "menuCtrl"
                    }
                }
            })
           .state("Game", {
                url: "/Game",
                views: {
                    "game": {
                        templateUrl: "views/gameView.html",
                        controller: "gameController",
                        controllerAs: "gameCtrl"
                    }
                }
            })
            .state("Score", {
                url: "/Score",
                views: {
                    "score": {
                        templateUrl: "views/scoreView.html",
                        controller: "scoreController",
                        controllerAs: "scoreCtrl"
                    }
                }
            })

    })