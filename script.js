//elements from document
let gridContainer = document.querySelector('.gridContainer');


Players = (name) => {
    let sayName = function() {
        return `My name is ${name}`;
    }
    return {name, sayName}
}

let gameFlow = (() => {
    let currentCounter = 'X';
    addListenersGridSquares = () => {
        let sqaures = Array.from(document.querySelectorAll('.gridSquare'));
        sqaures.forEach((square) => {
        square.addEventListener('click', function(e) { //function to populate clicked square
            let squareNum = e.path[0].classList[1];
            let squareIndex = [Math.floor(squareNum/3), squareNum%3];
            Gameboard.adjustGameBoard(squareIndex, currentCounter);
            if (currentCounter == 'X'){
                currentCounter = 'O'
            } else {
                currentCounter = 'X'
            }
            checkForWinner(Gameboard.getGameBoard());
        })
    })
    }
    checkForWinner = (gameBoardArr) => {
        console.log(gameBoardArr);
        //function to check for winner on row
        for (let i = 0; i < 3; i++) {
            let lineString = gameBoardArr[i].join('');
            let lineSet = new Set(gameBoardArr[i]);
            if (lineSet.size == 1 && lineString){
                console.log('a horizontal winner has been found')
                return
            }

            for (let j = 0; j < 3; j++){
                if (i > 0){
                    break;
                }
                if (j ==0){
                    let nwseArr = [gameBoardArr[i][j], gameBoardArr[i+1][j+1], gameBoardArr[i+2][j+2]]
                    let nwseSet = new Set(nwseArr);
                    if (nwseSet.size == 1 && nwseArr.join('')){
                        console.log('winner in nwse diagonal');
                        return;
                    }
                }
                if (j ==2){
                    let nwseArr = [gameBoardArr[i][j], gameBoardArr[i+1][j-1], gameBoardArr[i+2][j-2]]
                    let nwseSet = new Set(nwseArr);
                    if (nwseSet.size == 1 && nwseArr.join('')){
                        console.log('winner in nesw diagonal');
                        return;
                    }
                }
                let columnArr = [gameBoardArr[0][j], gameBoardArr[1][j], gameBoardArr[2][j]];
                let columnSet = new Set(columnArr);
                if (columnSet.size == 1 && columnArr.join('')){
                    console.log('there is a vertical winner');
                    return;
                }
            }
        }
    }
    return {addListenersGridSquares};
})();

let Gameboard = (() => {
    let _gameboardArray = [['','',''],['','',''],['','','']]
    //function to adjust board, takes index in form [y,x] and the content to input
    let _createGameBoard = function () {
        while (gridContainer.firstChild) {
            gridContainer.removeChild(gridContainer.lastChild);
        }
        let index =0;
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

    window.addEventListener('load', _createGameBoard());

    let adjustGameBoard = function(index, content){
        if (!(_gameboardArray[index[0]][index[1]])){
        _gameboardArray[index[0]][index[1]] = content;
        _createGameBoard();
        }
    }; 

    let getGameBoard = () => {
        return _gameboardArray;
    }
    return {adjustGameBoard, getGameBoard};
})();

