angular
    .module('ttt')
    .controller('menuController', menuController );

function menuController($http, $sessionStorage, $location) {
    var viewModel = this;
    viewModel.player = getStoredPlayerData();
    viewModel.state = getStoredState();
    viewModel.size = getStoredSize();

    function getStoredPlayerData() {
        if($sessionStorage.player) return $sessionStorage.player;
        else {
            alert("Перезаидите!");
            $location.url("/Login");
        }
    };

    function getStoredState() {
        if($sessionStorage.state) return $sessionStorage.state;
    };

    function storeState(state) {
        $sessionStorage.state = state;
        return state;
    };

    function getStoredSize() {
        if($sessionStorage.state) return Object.keys($sessionStorage.state).length;
        else return 3;
    };

    function defineFirst () {
        if($sessionStorage.player.first) $sessionStorage.player.first =false;
        else $sessionStorage.player.first = true;
    };

    
    viewModel.saveState = function () {
        let playerId = viewModel.player.id;
        viewModel.state = getStoredState();
        if(viewModel.state) {
            $http.put('/save/' + playerId, viewModel.state)
            .then(function(){
                alert('Игра сохранена');
            },function(){
                alert('Не удалось сохранить игру!');
            })
        }
    };

    viewModel.loadState = function () {
        let playerId = viewModel.player.id;
        $http.get('/load/' + playerId)
        .then (function(response) {
            if(response.data) {
                viewModel.state = storeState(response.data);
                viewModel.size = getStoredSize();
            }
            else alert("У Вас нет сохранений!")
        }),(function(){
            alert("Не удалось загрузить игру!");
        })
    };

    viewModel.game = function (startNew) {
        if(startNew){
            storeState(createBoard(viewModel.size));
            viewModel.showScale();
            defineFirst ();
        } 
        $location.url("/Game");
    };
    viewModel.score = function () {       
        $location.url("/Score");
    };

    viewModel.logout = function () {
        $sessionStorage.$reset();
        $location.url("/Login");
    };



    viewModel.sizes = createSizesScale();
    viewModel.scaleShown;
    viewModel.showScale = function(){viewModel.scaleShown=!viewModel.scaleShown};
    viewModel.selectLevel = function(size) {
        viewModel.size = size;
	viewModel.game(true);
    };


};

function createSizesScale () {
    let scale = [];
    for(let s = 0; s < 8; s++) {
        let difficulty;
        if(s>5) difficulty = 'Cложно';
        else if (s>2) difficulty = 'Cредне';
        else difficulty = 'Просто';
        let level = {key:s + 2,value:difficulty};
        scale.push(level);
    }
    return scale; 
};

function createBoard(size) {
    let board = {};
    for(let l = 0; l<size; l++) { 
        board[l] = {};
        for(let c = 0; c<size;c++) {
            board[l][c] = '';
        }
    }    
    return board;
};




