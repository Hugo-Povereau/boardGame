let TURN = 0;
let PieceId = 0;
let currentPlayers = [0,1,2,3];
let nbPieces = [0,0,0,0];

function setPieceId(value) {
    PieceId = value;
}

function rmPlayer(value) {
    currentPlayers.splice(value,1);
}

export {TURN, PieceId, currentPlayers, nbPieces, setPieceId, rmPlayer}
