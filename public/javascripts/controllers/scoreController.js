angular
    .module('ttt')
    .controller('scoreController', scoreController );

function scoreController($http, $location, $sessionStorage) {
    viewModel = this;
    viewModel.score;
    viewModel.refresh = getScore();
    viewModel.menu = function(){
        $location.url("/Menu");
    };
    viewModel.logout = function () {
        $sessionStorage.$reset();
        $location.url("/Login");
    };
    function getScore(){
        $http.get('/getScore')
        .then (function(response) {
            viewModel.score = response.data;
        })        
    };
}

