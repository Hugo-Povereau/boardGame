import {INVALID_MOVE,TurnOrder,ActivePlayers} from 'boardgame.io/core';
import {PieceId, setPieceId, currentPlayers, rmPlayer, nbPieces} from "./const";

export let pieceId = PieceId;
export let diagonale = true;
export let tour = 0;

export const Blokus = ({
    setup: () => ({cells: Array(400).fill(null)}),

    turn: {
        order: TurnOrder.ONCE,
        minMoves: 1,
        maxMoves: 1,
    },
    moves: {
        selectPiece: (idPiece) => {
            setPieceId(idPiece);
        },
        clickCell: (G, ctx, id, idPiece) => {
            diagonale = false;
            console.log(currentPlayers);
            if(id===500) {
                return rmPlayer(ctx.currentPlayer);
            }
            if(!currentPlayers.includes(parseInt(ctx.currentPlayer))){
                document.getElementById('piece' + (ctx.currentPlayer)).style.display = 'none';
                document.getElementById('piece' + (Number(ctx.currentPlayer) + 1) % 4).style.display = 'block';
                if (ctx.currentPlayer == 3) {
                    tour += 1;
                    setPieceId(tour);
                }
                return
            }

            for (let i = 0; i < 5; i++) {

                //Les cases sont vides
                if (G.cells[id + initPiece()[idPiece][i]] !== null) {
                    return INVALID_MOVE;
                }
                //Les cases sont côtes à côtes
                if (i < 4) {
                    if (((id + initPiece()[idPiece][i]) % 20) === 19 && ((id + initPiece()[idPiece][i + 1]) % 20) === 0) {
                        return INVALID_MOVE;
                    }
                }

                //Les mêmes pièces ne se touchent pas
                if (G.cells[id + initPiece()[idPiece][i] + 1] === ctx.currentPlayer || G.cells[id + initPiece()[idPiece][i] - 1] === ctx.currentPlayer || G.cells[id + initPiece()[idPiece][i] + 20] === ctx.currentPlayer || G.cells[id + initPiece()[idPiece][i] - 20] === ctx.currentPlayer) {
                    return INVALID_MOVE;
                }

                //Les pièces se touchent au moins une fois en diagonale
                if (G.cells[id + initPiece()[idPiece][i] + 21] === ctx.currentPlayer || G.cells[id + initPiece()[idPiece][i] - 21] === ctx.currentPlayer || G.cells[id + initPiece()[idPiece][i] + 19] === ctx.currentPlayer || G.cells[id + initPiece()[idPiece][i] - 19] === ctx.currentPlayer) {
                    diagonale = true;
                }
            }
            if (tour !== 0 && diagonale == false) {
                return INVALID_MOVE;
            }
            if (tour === 0) {
                let coin = false;
                for (let i = 0; i < 5; i++) {
                    if ([0, 19, 380, 399].includes(id + initPiece()[idPiece][i])) {
                        coin = true;
                    }
                }
                if(coin === false){
                    return INVALID_MOVE;
                }
            }
            for (let i = 0; i < 5; i++) {

                //Attribution l'id du joueur sur les cases
                for (let i = 0; i < 5; i++){
                    G.cells[id + initPiece()[idPiece][i]] = ctx.currentPlayer;
                }

                let somme = ((Number(ctx.currentPlayer)+1)*1000 + idPiece);
                let test = document.querySelectorAll(`[data-name=${CSS.escape(somme)}]`);
                test.forEach(div => div.className='miniCell');

                nbPieces[ctx.currentPlayer] += 1;

                //Changement de couleur des cases
                for (let i = 0; i < 5; i++) {
                    const bloc = id + initPiece()[idPiece][i];
                    document.querySelector(`[data-id=${CSS.escape(bloc)}]`).classList.add('color' + ctx.currentPlayer);
                }
                diagonale = false;
                document.getElementById('piece' + (ctx.currentPlayer)).style.display = 'none';
                document.getElementById('piece' + (Number(ctx.currentPlayer) + 1) % 4).style.display = 'block';

                if (ctx.currentPlayer == 3) {
                    tour += 1;
                    setPieceId(tour);
                }
                return;
            }
        },
    },
    endIf: (G, ctx) => {
        if (currentPlayers.length===0) {

            let max = Math.max.apply(null,nbPieces);
            let GGPlayers = getAllIndexes(nbPieces,max);

            if(GGPlayers.length>1){
                return {draw: GGPlayers};
            }
            else{
                return {winner: GGPlayers[0]};
            }
        }
    },
    ai: {
        enumerate: (G, ctx) => {
            let moves = [];
            for (let i = 0; i < 400; i++) {
                if (G.cells[i] === null) {
                    moves.push({move: 'clickCell', args: [i]});
                }
            }
            return moves;
        },
    },
});

//Liste des pièces
export function initPiece() {
    const forms = [
        [0, 0, 0, 0, 0],
        [0, 20, 0, 0, 0],
        [0, 20, 40, 0, 0], [0, 20, 21, 0, 0],
        [0, 20, 40, 60, 0], [0, 20, 40, 41, 0], [0, 20, 21, 40, 0], [0, 1, 20, 21, 0], [0, 1, 21, 22, 0],
        [0, 20, 40, 60, 80], [0, 20, 40, 60, 61], [0, 20, 40, 41, 61], [0, 20, 21, 40, 41], [0, 1, 20, 40, 41], [0, 20, 21, 40, 60], [0, 1, 2, 21, 41],
        [0, 20, 40, 41, 42], [0, 1, 21, 22, 42], [0, 20, 21, 22, 42], [0, 20, 21, 22, 41], [1, 20, 21, 22, 41]

    ];

    return forms;
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}