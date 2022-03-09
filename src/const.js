let TURN = 0;
let PieceId = 0;
let currentPlayers = [0,1,2,3];
let currentPlayer = 0;
let nbPieces = [0,0,0,0];

function setPieceId(value) {
    PieceId = value;
}

function  nextPlayer() {
    currentPlayer = (currentPlayer + 1) % currentPlayers.length
}

function rmPlayer(value) {
    currentPlayers.splice(value,1);
}

export {TURN, PieceId, currentPlayers, currentPlayer,nbPieces, setPieceId, nextPlayer, rmPlayer}
