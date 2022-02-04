Players = (name) => {
    let sayName = function() {
        return `My name is ${name}`;
    }
    return {name, sayName}
}

let gameFlow = (() => {
    let currentCounter = 'X';

    let winner;

    let gameMode;
    

    //function for determining which game mode is selected
    
    let playModeBtns = Array.from(document.querySelectorAll('.play'));

    playModeBtns.forEach((button) => {
        button.addEventListener('click', (e) => {
            let gamePlay = e.srcElement;
            
            for (let i = 0; i < playModeBtns.length; i++){
                playModeBtns[i].classList.remove('selectedMode');
            }
            gamePlay.classList.add('selectedMode');
            if (gameMode != gamePlay.textContent){
                gameMode = gamePlay.textContent;
                _commenceGame(gameMode);
            }
        })
    })

    let difficultyControl = document.querySelector('.difficultyControl');

    _commenceGame = () => {
        turn = 0;
        if (gameMode == 'Single Player') {
            difficultyControl.style.visibility = 'visible';
        }
        else {
            difficultyControl.style.visibility = 'hidden';
        }
        Gameboard.resetGameBoard();
        currentCounter = 'X';
        Gameboard._createGameBoard();
        nextTurn();
    }

    computerTakeTurnEasy = () => {
        let array = Gameboard.getGameBoard();
        for (let i = 0; i < 9; i++){
            let ind1 = Math.floor(i/3);
            let ind2 = i % 3;
            if (array[ind1][ind2] == '') {
                Gameboard.adjustGameBoard([ind1, ind2], currentCounter);
                break;
            }
        }
    }

    computerTakeTurnMedium = () => {
        let array = Gameboard.getGameBoard();
        getLocation = () => {
            let squareNum = Math.floor(Math.random()*9);
            let ind1 = Math.floor(squareNum/3);
            let ind2 = squareNum % 3;
            return [ind1, ind2];
        }
        let [ind1, ind2] = getLocation();
        if (array[ind1][ind2] == '') {
            Gameboard.adjustGameBoard([ind1, ind2], currentCounter);
        }
        else {
            computerTakeTurnMedium();
        }

    }

    computerTakeTurnHard = () => {
        let bestMove = findBestMove(Gameboard.getGameBoard());
        console.log(bestMove);
        let ind1 = bestMove.row;
        let ind2 = bestMove.col;

        Gameboard.adjustGameBoard([ind1, ind2], currentCounter);
    }

    //logic for unbeatable minimax AI

    function anyMovesLeft(gameBoard){
        for (let i =0; i <3; i++){
            for(let j = 0; j < 3; j++){
                if (!(gameBoard[i][j])){
                    return true;
                }
            }
        }
        return false;
    }

    function evaluate(gameBoard){
        for (let i = 0; i < 3; i++){
            if (gameBoard[i][0] == gameBoard[i][1] && gameBoard[i][0] == gameBoard[i][2]){
                if (gameBoard[i][0] == 'X'){
                    return -10;
                }
                else {
                    return 10;
                }
            }
        }
        for (let j = 0; j < 3; j++){
            if (gameBoard[0][j] == gameBoard[1][j]  && gameBoard[0][j] == gameBoard[2][j]){
                if (gameBoard[0][j] == 'X'){
                    return -10;
                }
                else {
                    return 10;
                }
            }      
        }
        if (gameBoard[0][0] == gameBoard[1][1] && gameBoard[0][0] == gameBoard[2][2]){
            if (gameBoard[0][0] == 'X') {
                return -10;
            }
            else {
                return 10;
            }
        }
        if (gameBoard[0][2] == gameBoard[1][1] && gameBoard[0][2] == gameBoard[2][0]){
            if (gameBoard[0][2] == 'X') {
                return -10;
            }
            else {
                return 10;
            }
        }
        return 0;
    }

    function minimax(gameBoard, depth, isMax){
        let score = evaluate(gameBoard);

        if (score == 10) {
            return score - depth;
        }

        if (score == -10) {
            return score + depth;
        }

        if (!(anyMovesLeft(gameBoard))) {
            return 0;
        }

        if(isMax) {
            let best = -1000;

            for(let i = 0; i <3; i++){
                for (let j = 0; j <3; j++){
                    if (!(gameBoard[i][j])){

                        gameBoard[i][j] = 'O';

                        best = Math.max(best, minimax(gameBoard, depth +1, !isMax));
                        
                        gameBoard[i][j] = '';
                        
                    }
                }
                
            } 
            console.log(best);
            return best;
        }
        else {
            let best = 1000;

            for (let i =0 ;i < 3; i++){
                for (let j = 0; j < 3; j++){
                    if (!(gameBoard[i][j])){
                        gameBoard[i][j] = 'X';

                        best = Math.min(best, minimax(gameBoard, depth +1, !isMax));

                        gameBoard[i][j] = '';
                    }
                }
            }
            console.log(best);
            return best;
        }

    }

    function findBestMove(gameBoard){
        let bestValue = -1000
        let bestMove = {};
        bestMove.row = -1;
        bestMove.col = -1;

        for(let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                if (!(gameBoard[i][j])){

                    gameBoard[i][j] = 'O';

                    let moveVal = minimax(Gameboard.getGameBoard(), 0, false);

                    gameBoard[i][j] = ''

                    if (moveVal > bestValue) {
                        bestValue = moveVal;
                        bestMove.row = i;
                        bestMove.col = j;
                    }
                }
            }
        }
        return bestMove;
    }

    //end of minimax logic

    playerTakeTurn = () => {
        addListenersGridSquares();
    }

    let difficulty = document.querySelector('#difficulty');
    let selectedDifficulty = difficulty.value;

    difficulty.addEventListener('change', () => {
        if (difficulty.value != selectedDifficulty){
            selectedDifficulty = difficulty.value;
            _commenceGame();
        }
    })

    //turn logic
    turn = 0;

    nextTurn = () => {
        turn += 1;
        if (turn == 10){
            _theresAWinner('');
        }
        else if (gameMode == 'Two Players'){
            playerTakeTurn();
        }
        else {
            if (turn % 2 == 0) {
                if (difficulty.value == 'easy'){
                    setTimeout(computerTakeTurnEasy, 300);
                }
                else if (difficulty.value =='medium'){
                    setTimeout(computerTakeTurnMedium, 300);
                }
                else if (difficulty.value =='impossible'){
                    setTimeout(computerTakeTurnHard, 300);
                }
                
            }
            else {
                playerTakeTurn();
            }
        }
    }

    changeCounter = () => {
        if (currentCounter == 'X') {
            currentCounter = 'O'
        } else {
            currentCounter = 'X'
        }
    }
    
    addListenersGridSquares = () => {
        let sqaures = Array.from(document.querySelectorAll('.gridSquare'));
        sqaures.forEach((square) => {
        square.addEventListener('click', function(e) { //function to populate clicked square
            let squareNum = e.path[0].classList[1];
            let squareIndex = [Math.floor(squareNum/3), squareNum%3];
            Gameboard.adjustGameBoard(squareIndex, currentCounter);
            //_checkForWinner(Gameboard.getGameBoard());
        })
    })
    }

    _checkForWinner = (gameBoardArr) => {
        let winner;

        //function to check for winner on row
        for (let i = 0; i < 3; i++) {
            let lineArr = gameBoardArr[i]
            let lineSet = new Set(lineArr);
            if (lineSet.size == 1 && lineArr.join('')){
                winner = lineArr[i][0];
                break;
            }

            for (let j = 0; j < 3; j++){
                if (i > 0){
                    break;
                }
                if (j ==0){
                    let nwseArr = [gameBoardArr[i][j], gameBoardArr[i+1][j+1], gameBoardArr[i+2][j+2]]
                    let nwseSet = new Set(nwseArr)
                    if (nwseSet.size == 1 && nwseArr.join('')){
                        winner = gameBoardArr[i][j]
                        break;
                    }
                }
                if (j ==2){
                    let nwseArr = [gameBoardArr[i][j], gameBoardArr[i+1][j-1], gameBoardArr[i+2][j-2]]
                    let nwseSet = new Set(nwseArr);
                    if (nwseSet.size == 1 && nwseArr.join('')){
                        winner = gameBoardArr[i][j]
                        break;
                    }
                }
                let columnArr = [gameBoardArr[0][j], gameBoardArr[1][j], gameBoardArr[2][j]];
                let columnSet = new Set(columnArr);
                if (columnSet.size == 1 && columnArr.join('')){
                    winner = gameBoardArr[0][j]
                    break;
                }
            }
        }
        if (winner) {
            _theresAWinner(winner);
        }
        else {
            nextTurn();
        }
        
        
    }

    _theresAWinner = function (winner) {
        // a function which flashes screen and brings up page congragulating winner
        let resultScreen = document.querySelector('.resultScreen');
        let winnerText = document.querySelector('.winnerText');
        if (winner){
            winnerText.textContent = `Player ${winner} Wins!`;
        }
        else {
            winnerText.textContent = `That's a Draw!`;
        }
        resultScreen.style.display = 'flex';
    }

    //reset and reload the board / number of turns when a new game is commenced.
    let playAgainBtn = document.querySelector('.playAgain');
    playAgainBtn.addEventListener('click', () => {
        _commenceGame();
        let resultScreen = document.querySelector('.resultScreen');
        resultScreen.style.display = 'none';
        let winnerText = document.querySelector('.winnerText');
        winnerText.textContent = '';
    })

    return {addListenersGridSquares, changeCounter, _checkForWinner};
})();

let Gameboard = (() => {
    //gridContainer from document
    let gridContainer = document.querySelector('.gridContainer');

    let _gameboardArray = [['','',''],['','',''],['','','']]

    //createsBoard by creating divs within grid
    let _createGameBoard = function () {
        while (gridContainer.firstChild) {
            gridContainer.removeChild(gridContainer.lastChild);
        }
        let index = 0;
        for(let i = 0; i < _gameboardArray.length; i++){
            for (let j = 0; j < _gameboardArray.length; j++){
                let gridSquare = document.createElement('div');
                gridSquare.classList.add('gridSquare');
                gridSquare.classList.add(index)
                gridSquare.textContent = _gameboardArray[i][j];
                gridContainer.appendChild(gridSquare);
                index++;
            }
        }
        
    };

   

    //takes an index of board, if empty places next counter, increments counter & updates board
    let adjustGameBoard = function(index, currentCounter){
        if (!(_gameboardArray[index[0]][index[1]])){
            _gameboardArray[index[0]][index[1]] = currentCounter;
            _createGameBoard();
            gameFlow.changeCounter();
            _checkForWinner(Gameboard.getGameBoard());
        }
    }; 

    //resetGameBoard
    let resetGameBoard = function(){
        _gameboardArray = [['','',''],['','','',],['','','']];
    }

    //returns gameBoard array
    let getGameBoard = () => {
        return _gameboardArray;
    }
    return {adjustGameBoard, getGameBoard, resetGameBoard, _createGameBoard};
})();