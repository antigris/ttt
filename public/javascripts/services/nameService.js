angular
    .module('ttt')
    .service('nameService', nameService);

function nameService ($http, $sessionStorage, $location) {
    var player;
    function storeData(player) {
        $sessionStorage.playerId = player._id;
        $sessionStorage.playerName = player.name;
        $sessionStorage.playerAcr = acronym(player.name);
        let computerAcr = 'ИИ';
        if(acronym(player.name) ==='ИИ') computerAcr = 'ЦП';
        $sessionStorage.computerAcr = computerAcr;    
    };
    function addPlayer(log, pas) {
        player = {name:log,pass:pas,score:{wins:0,lose:0,draw:0}};
        $http.post('/players', player)
        .then(function(response) {
            player = response.data;
            storeData(player);
            alert("Игрок: " + log + " успешно добавлен");
            $location.url("/Menu");
        },function(response) {
            alert("Не удалось добавить игрока: " + log);
        })
    };
    return {
            check: function(log,pas) {
                $http.get('/login/' + log + '/' + pas)
                .then(function(response) {
                    player = response.data;
                    if(player!=undefined) {
                        storeData(player);
                        alert("Вы вошли как: " + log);
                        $location.url("/Menu");
                    }
                    else {
                        if(log =='Инкогнито') addPlayer(log,pas);
                        else alert("Имя или Пароль неправильные");
                    }
                    return player;
                })
            },
            add: function(log,pas) {
                $http.get('/login/' + log)
                .then(function(response){
                    player = response.data;
                    return player;
                })
                .then(function(player) {
                    if(player==undefined)  addPlayer(log,pas);
                    else alert("Игрок: " + log + " уже существует!");
                })
            },              
            getPlayer: function(id) {
                $http.get('/players/' + id).then (function(response) {
                    player = response.data;
                });
                return player;
            }, 
            playerAcronym: function () {
                $sessionStorage.playerAcr = acronym(player.name)
                return acronym(player.name);
            },
            computerAcronym: function() {
                let computerAcr = 'AI'
                if(acronym(player.name) ==='AI') computerAcr = 'CPU';
                $sessionStorage.computerAcr = computerAcr;
                return computerAcr;
            }           
        }
    };
    
function acronym (playerName){
    return playerName.substring(0,3).trim().toUpperCase();
};
   





