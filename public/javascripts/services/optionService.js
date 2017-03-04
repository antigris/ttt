angular
    .module('ttt')
    .service('optionService', optionService);

function optionService ($http, $location, $sessionStorage) {
    var size = 3;
    let playerFirst = false;
    return {
        getFirst: function () {
            playerFirst = !playerFirst;
            return playerFirst;
        },
        setSize: function(inSize){
            size = inSize;
        },
        getSize: function(){
            return size;
        },
        createBoard:function() {
            let board = {};
            for(let l = 0; l<size; l++) {    
                board[l] = {};
                for(let c = 0; c<size;c++) {
                    board[l][c] = '';
                    }
                }
            $sessionStorage.board = board;    
            return board;
        },
        winLines: function (){
            let lines = [];
            let winLine = '';
            let altWinLine = ''; 
            let crossWinLine = ''; 
            let altCrossWinLine = ''; 

            for(let l = 0; l<size; l++) {  
            crossWinLine+=l.toString()+l.toString()+' ';
            altCrossWinLine+=(size-1-l).toString()+l.toString()+' ';
            if(l===size-1) {
                crossWinLine = crossWinLine.trim();
                altCrossWinLine = altCrossWinLine.trim();
                lines.push(crossWinLine);
                lines.push(altCrossWinLine);
            }  
                for(let c = 0; c<size;c++) {
                        winLine+=l.toString()+c.toString()+' ';
                        altWinLine+=c.toString()+l.toString()+' ';
                    if(c===size-1) {
                        winLine = winLine.trim();
                        altWinLine = altWinLine.trim();
                        lines.push(winLine);
                        lines.push(altWinLine);
                    }
                }
                winLine = '';
                altWinLine = ''; 
            }
            return lines;
        }, 
        saveState: function () {
            let playerId = $sessionStorage.player.id;
            let state = $sessionStorage.state;
            $http.put('/save/' + playerId, state)
            .then(function(response){
                alert('Saved successfully');
            })
        },
        loadState: function() {
            let playerId = $sessionStorage.player.id;
            $http.get('/load/' + playerId)
            .then (function(response) {
              let state = response.data;
              size = Object.keys(state).length;

              $sessionStorage.board = state;
              console.log('loaded state: ');
              console.log($sessionStorage.board);
            });

        }
    }
}