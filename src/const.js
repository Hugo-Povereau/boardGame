let TURN = 0;
let PieceId = 0;
let currentPlayers = [0,1,2,3];
let currentPlayer = 0;
let nbPieces = [0,0,0,0];
let pieceSelected;

function setPieceSelected(value) {
    pieceSelected = value;
}

function setPieceId(value) {
    PieceId = value;
}

function  nextPlayer() {
    currentPlayer = currentPlayers[(currentPlayers.indexOf(currentPlayer)+1)%currentPlayers.length]
}

function rmPlayer(value) {
    currentPlayers.splice(currentPlayers.indexOf(value),1);
}

export {TURN, PieceId, pieceSelected, currentPlayers, currentPlayer,nbPieces, setPieceId, setPieceSelected, nextPlayer, rmPlayer}
