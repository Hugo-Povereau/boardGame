import { INVALID_MOVE } from 'boardgame.io/core';
import { TURN } from "./const";
import { TurnOrder } from 'boardgame.io/core';

export let pieceId = 12;

export const Blokus =  ({
    setup: () => ({ cells: Array(400).fill(null) }),

    turn: {
        order: TurnOrder.ONCE,
        minMoves: 1,
        maxMoves: 1,
    },
    moves: {
        selectPiece: (idPiece) => {
            pieceId = idPiece;
            //this.client.piece.test().test = idPiece;
        },
        clickCell: (G, ctx, id, idPiece) => {
            for(let i = 0; i < 5; i++){
                if (G.cells[id + initPiece()[ idPiece][i]] !== null) {
                    return INVALID_MOVE;
                }
                if(i<4){
                    let test = ((id + initPiece()[ idPiece][i])%20)+((id + initPiece()[ idPiece][i+1])%20);
                    if(((id + initPiece()[ idPiece][i])%20)===19 && ((id + initPiece()[ idPiece][i+1])%20)===0) {
                        return INVALID_MOVE;
                    }
                }
                if (G.cells[id + initPiece()[ idPiece][i]+1] === ctx.currentPlayer || G.cells[id + initPiece()[ idPiece][i]-1] === ctx.currentPlayer || G.cells[id + initPiece()[ idPiece][i]+20] === ctx.currentPlayer || G.cells[id + initPiece()[ idPiece][i]-20] === ctx.currentPlayer ) {
                    return INVALID_MOVE;
                }
            }
            for(let i = 0; i < 5; i++) {
                if (TURN !== 0 && (G.cells[id + initPiece()[idPiece][i] + 21] === ctx.currentPlayer || G.cells[id + initPiece()[idPiece][i] - 21] === ctx.currentPlayer || G.cells[id + initPiece()[idPiece][i] + 19] === ctx.currentPlayer || G.cells[id + initPiece()[idPiece][i] - 19] === ctx.currentPlayer)) {
                    console.log("ok");
                    G.cells[id + initPiece()[ idPiece][0]] = ctx.currentPlayer;
                    G.cells[id + initPiece()[ idPiece][1]] = ctx.currentPlayer;
                    G.cells[id + initPiece()[ idPiece][2]] = ctx.currentPlayer;
                    G.cells[id + initPiece()[ idPiece][3]] = ctx.currentPlayer;
                    G.cells[id + initPiece()[ idPiece][4]] = ctx.currentPlayer;
                    TURN+=1;
                    for (let i = 0; i < 5; i++) {
                        const test = id + initPiece()[ idPiece][i];
                        if (ctx.currentPlayer == 0) {
                            document.querySelector(`[data-id=${CSS.escape(test)}]`).classList.add('redCell');
                        } else if (ctx.currentPlayer == 1) {
                            document.querySelector(`[data-id=${CSS.escape(test)}]`).classList.add('blueCell');
                        } else if (ctx.currentPlayer == 2) {
                            document.querySelector(`[data-id=${CSS.escape(test)}]`).classList.add('yellowCell');
                        } else {
                            document.querySelector(`[data-id=${CSS.escape(test)}]`).classList.add('greenCell');
                        }
                    }
                }
                return;
            }
        }
    },
    endIf: (G, ctx) => {
        if (IsVictory(G.cells)) {
            return {winner: ctx.currentPlayer};
        }
        if (IsDraw(G.cells)) {
            return {draw: true};
        }
    },
    ai: {
        enumerate: (G, ctx) => {
            let moves = [];
            for (let i = 0; i < 400; i++) {
                if (G.cells[i] === null) {
                    moves.push({ move: 'clickCell', args: [i] });
                }
            }
            return moves;
        },
    },
});
function initPiece() {
    const forms = [
        [0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 1, 2, 0, 0], [0, 1, 2, 3, 0], [0, 1, 2, 3, 4], [0, 1, 20, 0, 0],
        [0, 1, 2, 20, 0], [0, 1, 2, 21, 0], [0, 1, 20, 21, 0], [0, 1, 21, 22, 0], [0, 1, 2, 3, 20], [0, 1, 2, 22, 23],
        [0, 1, 2, 20, 21], [0, 1, 21, 22, 42], [0, 1, 21, 41, 42], [0, 1, 20, 40, 41], [0, 1, 2, 20, 40], [0, 1, 2, 3, 21],
        [1, 20, 21, 22, 41], [0, 1, 21, 22, 41], [0, 1, 2, 21, 41],

    ];

    return forms;
}

/*function getCurrentPiece() {
    return piece
}*/

function IsVictory(cells) {
    const positions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    const isRowComplete = row => {
        const symbols = row.map(i => cells[i]);
        return symbols.every(i => i !== null && i === symbols[0]);
    };

    return positions.map(isRowComplete).some(i => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
    return cells.filter(c => c === null).length === 0;
}
