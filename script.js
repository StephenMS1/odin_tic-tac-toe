//elements from document
let gridContainer = document.querySelector('.gridContainer');


Players = (name) => {
    let sayName = function() {
        return `My name is ${name}`;
    }
    return {name, sayName}
}

let Gameboard = (() => {
    let _gameboardArray = [['X','O',''],['','',''],['','','']]
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
        addListenersGridSquares();
    };
    window.addEventListener('load', _createGameBoard());
    let adjustGameBoard = function(index, content){
        if (!(_gameboardArray[index[0]][index[1]]))
        _gameboardArray[index[0]][index[1]] = content;
        _createGameBoard();
    }; 
    return {adjustGameBoard};
})();



function addListenersGridSquares() {
    let sqaures = Array.from(document.querySelectorAll('.gridSquare'));
    sqaures.forEach((square) => {
        square.addEventListener('click', function(e) { //function to populate clicked square
            let squareNum = e.path[0].classList[1];
            let squareIndex = [Math.floor(squareNum/3), squareNum%3];
            console.log(squareIndex);
            Gameboard.adjustGameBoard(squareIndex, 'yeah BOI');
        })
    })
}