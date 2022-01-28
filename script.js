
Players = (name) => {
    let sayName = function() {
        return `My name is ${name}`;
    }
    return {name, sayName}
}

let gameFlow = (() => {
    let currentCounter = 'X';

    let winner;

    //function for determining which game mode is selected

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
            let lastCounter = Gameboard.adjustGameBoard(squareIndex, currentCounter);
            _checkForWinner(Gameboard.getGameBoard());
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
                console.log('a horizontal winner has been found')
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
                        console.log('winner in nwse diagonal');
                        winner = gameBoardArr[i][j]
                        break;
                    }
                }
                if (j ==2){
                    let nwseArr = [gameBoardArr[i][j], gameBoardArr[i+1][j-1], gameBoardArr[i+2][j-2]]
                    let nwseSet = new Set(nwseArr);
                    if (nwseSet.size == 1 && nwseArr.join('')){
                        console.log('winner in nesw diagonal');
                        winner = gameBoardArr[i][j]
                        break;
                    }
                }
                let columnArr = [gameBoardArr[0][j], gameBoardArr[1][j], gameBoardArr[2][j]];
                let columnSet = new Set(columnArr);
                if (columnSet.size == 1 && columnArr.join('')){
                    console.log('there is a vertical winner');
                    winner = gameBoardArr[0][j]
                    break;
                }
            }
        }
        if (winner) {
            _theresAWinner(winner);
        }
    }
    _theresAWinner = function (winner) {
        // a function which flashes screen and brings up page congragulating winner
        console.log(`winner is ${winner}`);
    }
    return {addListenersGridSquares, changeCounter};
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
        gameFlow.addListenersGridSquares();
    };

    //create gameboard instantly
    window.addEventListener('load', _createGameBoard());

    //takes an index of board, if empty places next counter, increments counter & updates board
    let adjustGameBoard = function(index, currentCounter){
        if (!(_gameboardArray[index[0]][index[1]])){
            _gameboardArray[index[0]][index[1]] = currentCounter;
            _createGameBoard();
            gameFlow.changeCounter();
        }
    }; 

    //resetGameBoard
    let resetGameBoard = function(){
        _gameboardArray = [['','',''],['','','',],['','','']];
        _createGameBoard();
    }

    //returns gameBoard array
    let getGameBoard = () => {
        return _gameboardArray;
    }
    return {adjustGameBoard, getGameBoard, resetGameBoard};
})();