angular
    .module('ttt')
    .controller('gameController', gameController );

function gameController($http, $sessionStorage, $location) {
    viewModel = this;
    viewModel.player = getStoredPlayerData().acr;
    viewModel.computer = getStoredPlayerData().cpu;
    viewModel.playerFirst = $sessionStorage.player.first;
    viewModel.board = getStoredState();
    viewModel.size = getStoredSize();
    viewModel.lines = longWinLines(viewModel.size);
    viewModel.winLine;

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
    };    

    function over(winner) {
        let save = false;
        switch(winner) {
            case viewModel.player:
            save = true
            $sessionStorage.canvasState = 0;
            alert(viewModel.player + " подебил!!!");
                break;
            case viewModel.computer:
            save = true
            $sessionStorage.canvasState =-1;
            alert(viewModel.computer + " подебил...");
                break;
            case true:
            save = true;
            $sessionStorage.canvasState = 1;
            alert(" очередная ничья???");
                break;
                
        }
        if(save) {
            saveScore(winner);
            overFill(viewModel.board,viewModel.size);
        }
    };

    function saveScore (winner) {
        let playerId = getStoredPlayerData().id;
        $http.get('/playerScore/' + playerId)
        .then(function(response){
            return response.data;            
        }).then(function(score) {
            switch(winner) {
                case viewModel.player:
                score.wins++;
                    break;
                case viewModel.computer:
                score.lose++;
                    break;
                case true:
                score.draw++;
                    break;
            };
            $http.put('/updateScore/' + playerId,score);
            cpuScore (winner);
        })
    }; 


    function cpuScore (winner) {
        $http.get('/login/Компьютер')
        .then(function(response){            
            return response.data;           
        }).then(function(cpu) {
            let id = cpu._id;
            let score = cpu.score;
            switch(winner) {
                case viewModel.player:
                score.lose++;
                    break;
                case viewModel.computer:
                score.wins++;
                    break;
                case true:
                score.draw++;
                    break;
            };
            $http.put('/updateScore/' + id,score)
        })
    }; 


    if(!viewModel.playerFirst) {
        let choice = selectCell(viewModel.board, viewModel.lines, viewModel.player, viewModel.computer);
        viewModel.board[choice.key.substring(0,1)][choice.key.substring(1,2)] = viewModel.computer;     
	$sessionStorage.player.first = true;   
    }

else $sessionStorage.player.first = false;

    viewModel.step = function (cell) {
        viewModel.board[cell.substring(0,1)][cell.substring(1,2)] = viewModel.player;
        let winner =  defineWinner(viewModel.board, viewModel.lines, viewModel.player, viewModel.computer);
        if(winner == false) {
            let choice = selectCell(viewModel.board, viewModel.lines, viewModel.player, viewModel.computer);
            viewModel.board[choice.key.substring(0,1)][choice.key.substring(1,2)] = viewModel.computer;
            winner =  defineWinner(viewModel.board, viewModel.lines, viewModel.player, viewModel.computer);
        }
        over(winner);
    };

    viewModel.restart = function(){
        $sessionStorage.canvasState = 1;
        viewModel.board = createBoard(viewModel.size);
	    viewModel.winLine = null;
        storeState(viewModel.board)
    };

    viewModel.menu = function () {  
        $sessionStorage.canvasState = 1;
        $location.url("/Menu");
    };

    viewModel.logout = function () {
        $sessionStorage.$reset();
        $location.url("/Login");
    };

    viewModel.color = function(cell) {
        let cellOwner = viewModel.board[cell.substring(0,1)][cell.substring(1,2)];
        if(viewModel.winLine && contains(viewModel.winLine.split(' '), cell)) {
                switch(cellOwner) {
                    case viewModel.player: return 'playerWin';
                    case viewModel.computer: return 'cpuWin';
                }
        }
        switch(cellOwner) {
            case viewModel.player: return 'playerOwned';
            case viewModel.computer: return 'cpuOwned';
        }
        return 'cellButton';
    };   


}

function contains(array, value) {
    return (array.indexOf(value) > -1);
};

function containsKey(array, key) {
    for(i=0;i<array.length;i++) {
        if(array[i]["key"] == key) return i;        
    }
    return -1;
};

function defineWinner(boardState,lines, player, computer) {
    let size = lines[0].split(' ').length; 
    let draw = true ;
    for(let w=0; w<lines.length; w++) {
      let pl = 0; let cp = 0; let no = 0   
      cells = lines[w].split(' ');   
        for(let c = 0; c<size; c++) {   
            let cellOwner = boardState[cells[c].substring(0,1)][cells[c].substring(1,2)];
            if (cellOwner == player) pl++ ;
            else if (cellOwner == computer) cp++;
            else no++;
        }
        if(no > 0 && (pl == 0||cp == 0)) draw = false;
        else if (pl == size) {
            viewModel.winLine = lines[w];
            return player;
        }
        else if (cp == size) {
           viewModel.winLine = lines[w];
           return computer;
        } 
    }    
    return draw;
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

function selectWinlines(size) {
    let lines =[];
    if(size<5) lines = longWinLines(size);
    else lines = winLines(size);
    return lines;
};

function winLines(size) {
    let winSize = defineWinSize(size);
    let lines = [];
    for(let l = 0;l<size-winSize+1;l++) {
        for(let c = 0; c<size-winSize+1; c++) {
            let shortLines =  oneSampleLines(l,c); 
            for(let s=0;s<shortLines.length;s++) if(!contains(lines,shortLines[s])) lines.push(shortLines[s]);
        }
    }
    return lines;
};

function defineWinSize(size) {
    if(size<5) return size;
    else return 3;   //??
};


function oneSampleLines(deltaL,deltaC,size) {
    let winSize = defineWinSize(size);
    let lines = [];
    let winLine = '';
    let altWinLine = ''; 
    let crossWinLine = ''; 
    let altCrossWinLine = ''; 

    for(let l = deltaL; l<3+deltaL; l++) {  
       crossWinLine+=l.toString()+l.toString()+' ';
       altCrossWinLine+=(deltaL+2-l).toString()+(l).toString()+' ';
       if(l===2+deltaL) {
           crossWinLine = crossWinLine.trim();
           altCrossWinLine = altCrossWinLine.trim();
           lines.push(crossWinLine);
           lines.push(altCrossWinLine);
       }  
       for(let c = deltaC; c<3+deltaC;c++) {
            winLine+=l.toString()+c.toString()+' ';
            altWinLine+=c.toString()+l.toString()+' ';
            if(c===2+deltaC) {
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
};

function longWinLines(size) {
    
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
};


function selectCell(boardState, lines, player, computer) {
    let size = lines[0].split(' ').length;
    let freeCells = [];
 //   let winSize = defineWinSize(size);


    for(let w = 0; w<lines.length; w++) { 
        let pl = 0; let cp = 0; let tempCells = [];   

        for(let l = 0; l<size; l++) {       

            for(let c = 0; c<size; c++) { 
                cellKey = l.toString() + c.toString();
                if(contains(lines[w].split(' '),cellKey)) {
                    let cellOwner = boardState[l][c];
                                
                    if (cellOwner == player) pl++;
                    else if (cellOwner == computer) cp++;
                    else{
                        let cell = {};
                        cell.key = cellKey;
                        cell.value = 0;
                        let cellIndex = containsKey(tempCells, cell.key);
                        if(cellIndex==-1) tempCells.push(cell);
                    }
                }
            }
        }
        let priority = 1;
        if (cp == size-1) priority = 13; 
        else if (pl == size-1) priority = 12;        
        for(let t = 0; t< tempCells.length; t++ ) {
            tempCells[t].value+=priority;
        }
        for(let t = 0; t< tempCells.length; t++ ) {
            let cellIndex = containsKey(freeCells, tempCells[t].key) 
            if(cellIndex ==-1) freeCells.push(tempCells[t]);                     
            else freeCells[cellIndex].value+= tempCells[t].value;  
        }
    }

    return bestCell(freeCells);
};

function bestCell (freeCells) {
    let bestCell =  {};
    if(freeCells.length > 0) {        
        bestCell = freeCells[0];
    }
    for(let b = 0; b< freeCells.length; b++) {
        if(bestCell.value < freeCells[b].value) bestCell = freeCells[b];
    }
    return bestCell;
};

function overFill(board, size){
    for(let l = 0; l<size; l++){
        for(let c = 0; c<size; c++){
            if(board[l][c] =='') board[l][c] = ' ';
        }
    }
};