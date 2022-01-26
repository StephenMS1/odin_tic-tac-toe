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
        for(let i = 0; i < _gameboardArray.length; i++){
            for (let j = 0; j < _gameboardArray.length; j++){
                let gridSquare = document.createElement('div');
                gridSquare.classList.add('gridSquare');
                gridSquare.textContent = _gameboardArray[i][j];
                gridContainer.appendChild(gridSquare);
            }
        }

    };
    let adjustGameBoard = function(index, content){
        console.log(index);
        _gameboardArray[index[0]][index[1]] = content;
        _createGameBoard();
    }; 
    return {adjustGameBoard};
})();

Gameboard.adjustGameBoard([0,0], 'bite me');


