let TURN = 0;
let PieceId = -1;
let currentPlayers = [0,1,2,3];
let currentPlayer = 0;
let nbPieces = [0,0,0,0];
let pieceSelected;
let rotation = 0;
let flip = 0;
let isEnded = false;

function setPieceSelected(value) {
    pieceSelected = value;
}

function setRotation(value) {
    rotation = value;
}

function setFlip(value) {
    flip = value;
}

function setPieceId(value) {
    PieceId = value;
}

function theEnd() {
    isEnded = true;
}

function  nextPlayer() {
    currentPlayer = currentPlayers[(currentPlayers.indexOf(currentPlayer)+1)%currentPlayers.length]
}

function rmPlayer(value) {
    currentPlayers.splice(currentPlayers.indexOf(value),1);
}

export {TURN, isEnded, PieceId, pieceSelected, rotation, flip, currentPlayers, currentPlayer,nbPieces, theEnd, setPieceId, setPieceSelected, setRotation, setFlip, nextPlayer, rmPlayer}
