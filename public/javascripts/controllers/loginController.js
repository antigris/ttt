angular
    .module('ttt')
    .controller('loginController', loginController );

function loginController ($http, $sessionStorage, $location) {
    var viewModel = this;
    viewModel.login = function (log, pas){
        $http.get('/login/' + log + '/' + pas)
        .then(function(response) {
            player = response.data;
            if(player!=undefined) {
                storePlayerData(player);
                alert("Вы вошли как: " + log);
                $location.url("/Menu");
            }
            else {
                if(log =='Инкогнито') addPlayer(log,pas);
                else alert("Имя или Пароль неправильные")
            }
            return player;
        })
    };

    viewModel.add = function(log, pas) {
        $http.get('/login/' + log)
        .then(function(response){
            player = response.data;
            return player;
        })
        .then(function(player){ 
            if(player==undefined) addPlayer(log,pas)
            else alert("Игрок: " + log + " уже существует!")
        })
    };

    function addPlayer(log, pas) {
        player = {name:log, pass:pas, score:{wins:0,lose:0,draw:0}};
        $http.post('/players', player)
        .then(function(response) {
            player = response.data;
            storePlayerData(player);
            alert("Игрок: " + log + " успешно добавлен");
            $location.url("/Menu");
        }, function() {
            alert("Не удалось добавить игрока: " + log);
        })
    };

    function storePlayerData(player) {
        $sessionStorage.player = playerData(player);        
    };
};

function playerData(player) {
    var data = {
        id: player._id,
        name: player.name,
        acr: acronym(player.name),
        cpu: cpuAcronym (player.name),
        first: false
    };
    return data;
};

function acronym (playerName){
    return playerName.substring(0,3).trim().toUpperCase();
};

function cpuAcronym (playerName) {
    if(acronym(playerName).substring(0,1) =='Ц') return 'ИИ';
    return 'ЦП';
};



