import {INVALID_MOVE, TurnOrder} from 'boardgame.io/core';
import {
    currentPlayers,
    currentPlayer,
    nbPieces,
    rotation,
    PieceId,
    nextPlayer,
    rmPlayer,
    setPieceId,
    pieceSelected, setPieceSelected, setRotation
} from "./const";

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
        clickCell: (G, ctx, id, idPiece) => {
            diagonale = false;
            if (id === 500) {

                const flag = currentPlayer
                Blokus.switchPlayer(G, ctx);
                rmPlayer(flag);
                return
            }
            for (let i = 0; i < 5; i++) {

                //Les cases sont vides
                if (G.cells[id + initPiece(rotation)[idPiece][i]] !== null) {
                    return INVALID_MOVE;
                }
                //Les cases sont côtes à côtes
                if (i < 4) {
                    if (((id + initPiece(rotation)[idPiece][i]) % 20) === 19 && ((id + initPiece(rotation)[idPiece][i + 1]) % 20) === 0) {
                        return INVALID_MOVE;
                    }
                }

                //Les mêmes pièces ne se touchent pas
                if (G.cells[id + initPiece(rotation)[idPiece][i] + 1] === currentPlayer || G.cells[id + initPiece(rotation)[idPiece][i] - 1] === currentPlayer || G.cells[id + initPiece(rotation)[idPiece][i] + 20] === currentPlayer || G.cells[id + initPiece(rotation)[idPiece][i] - 20] === currentPlayer) {
                    return INVALID_MOVE;
                }

                //Les pièces se touchent au moins une fois en diagonale
                if (G.cells[id + initPiece(rotation)[idPiece][i] + 21] === currentPlayer || G.cells[id + initPiece(rotation)[idPiece][i] - 21] === currentPlayer || G.cells[id + initPiece(rotation)[idPiece][i] + 19] === currentPlayer || G.cells[id + initPiece(rotation)[idPiece][i] - 19] === currentPlayer) {
                    diagonale = true;
                }
            }
            if (tour !== 0 && diagonale === false) {
                return INVALID_MOVE;
            }
            if (tour === 0) {
                let coin = false;
                for (let i = 0; i < 5; i++) {
                    if ([0, 19, 380, 399].includes(id + initPiece(rotation)[idPiece][i])) {
                        coin = true;
                    }
                }
                if (coin === false) {
                    return INVALID_MOVE;
                }
            }
            for (let i = 0; i < 5; i++) {

                //Attribution l'id du joueur sur les cases
                for (let i = 0; i < 5; i++) {
                    G.cells[id + initPiece(rotation)[idPiece][i]] = currentPlayer;
                }

                let somme = ((currentPlayer + 1) * 1000 + idPiece);
                let test = document.querySelectorAll(`[data-name=${CSS.escape(somme)}]`);
                test.forEach(div => div.className = 'miniCell');
                test.item(0).attributes.removeNamedItem('data-name');

                nbPieces[currentPlayer] += 1;

                //Changement de couleur des cases
                for (let i = 0; i < 5; i++) {
                    const bloc = id + initPiece(rotation)[idPiece][i];
                    document.querySelector(`[data-id=${CSS.escape(bloc)}]`).classList.add('color' + currentPlayer);
                }
                diagonale = false;
                document.querySelector(`[data-id=\"500\"]`).style.removeProperty('background');

                return Blokus.switchPlayer(G, ctx);
            }
        },
    },
    endIf: (G, ctx) => {
        if (currentPlayers.length === 0) {

            let max = Math.max.apply(null, nbPieces);
            let GGPlayers = getAllIndexes(nbPieces, max);

            if (GGPlayers.length > 1) {
                return {draw: GGPlayers};
            } else {
                return {winner: GGPlayers[0]};
            }
        }
    },
    switchPlayer: (G, ctx) => {
        if(currentPlayers.length>1){
            document.getElementById("button").style.removeProperty('background');
            document.querySelector(`[data-id=\"500\"]`).classList.add('color' + currentPlayers[(currentPlayers.indexOf(currentPlayer)+1)%currentPlayers.length]);
            document.querySelector(`[data-id=\"500\"]`).classList.remove('color' + currentPlayer);
        }

        if (currentPlayers.length !== 0) {
            document.getElementById('piece' + (currentPlayer)).style.display = 'none';
            document.getElementById('piece' + currentPlayers[(currentPlayers.indexOf(currentPlayer) + 1) % currentPlayers.length]).style.display = 'block';

            if (currentPlayer === currentPlayers[currentPlayers.length - 1]) {
                tour += 1;
            }
            setPieceId(-1);
            return nextPlayer()
        }
        Blokus.endIf(G, ctx)
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
export function initPiece(rotation) {
    //pos de base
    const tab1 = [
        [0, 0, 0, 0, 0],
        [0, 20, 0, 0, 0],
        [0, 20, 40, 0, 0], [0, 20, 21, 0, 0],
        [0, 20, 40, 60, 0], [0, 20, 40, 41, 0], [0, 20, 21, 40, 0], [0, 1, 20, 21, 0], [0, 1, 21, 22, 0],
        [0, 20, 40, 60, 80], [0, 20, 40, 60, 61], [0, 20, 40, 41, 61], [0, 20, 21, 40, 41], [0, 1, 20, 40, 41], [0, 20, 21, 40, 60], [0, 1, 2, 21, 41],
        [0, 20, 40, 41, 42], [0, 1, 21, 22, 42], [0, 20, 21, 22, 42], [0, 20, 21, 22, 41], [1, 20, 21, 22, 41]
    ]

    //90° anti horaire
    const tab2 = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 2, 0, 0], [0, 1, -19, 0, 0],
        [0, 1, 2, 3, 0], [0, 1, 2, -18, 0], [0, 1, -19, 2, 0], [0, 1, 20, 21, 0], [0, -20, -19, -49, 0],
        [0, 1, 2, 3, 4], [0, 1, 2, 3, -17], [0, 1, 2, -18, -17], [0, 1, -19, 2, -18], [0, -20, 1, 2, -18], [0, 1, -19, 2, 3], [0, -20, -40, -18, -17],
        [0, 1, 2, -18, -38], [0, -20, -19, -39, -38], [0, 1, -19, -39, -38], [0, 1, -19, -18, -39], [1, 20, 21, 22, 41]
    ]

    //180°
    const tab3 = [
        [0, 0, 0, 0, 0],
        [0, 20, 0, 0, 0],
        [0, 20, 40, 0, 0], [0, -20, -21, 0, 0],
        [0, 20, 40, 60, 0], [0, -20, -40, -41, 0], [0, -20, -21, -40, -0], [0, 1, 20, 21, 0], [0, -1, -21, -22, 0],
        [0, 20, 40, 60, 80], [0, -20, -40, -60, -61], [0, -20, -40, -41, -61], [0, -20, -21, -40, -41], [0, -1, -20, -40, -41], [0, -20, -21, -40, -60], [0, -1, -2, -21, -41],
        [0, -20, -40, -41, -42], [0, -1, -21, -22, -42], [0, -20, -21, -22, -42], [0, -20, -21, -22, -41], [1, 20, 21, 22, 41]
    ]
    
    //270° 
    const tab4 = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 2, 0, 0], [0, -1, 19, 0, 0],
        [0, 1, 2, 3, 0], [0, -1, -2, 18, 0], [0, -1, 19, -2, 0], [0, 1, 20, 21, 0], [0, 20, 19, 49, 0],
        [0, 1, 2, 3, 4], [0, -1, -2, -3, 17], [0, -1, -2, 18, 17], [0, -1, 19, -2, 18], [0, 20, -1, -2, 18], [0, -1, 19, -2, -3], [0, 20, 40, 18, 17],
        [0, -1, -2, 18, 38], [0, 20, 19, 39, 38], [0, -1, 19, 39, 38], [0, -1, 19, 18, 39], [-1, -20, -21, -22, -41]
    ]

    const tab = [tab1, tab2, tab3, tab4]
    return tab[rotation];
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) !== -1) {
        indexes.push(i);
    }
    return indexes;
}

document.addEventListener('click', function (event) {
    let element = document.elementFromPoint(event.x, event.y);
    if (element.hasAttribute('data-name')) {
        let old = document.querySelectorAll("[data-name=\'" + pieceSelected + "\']");
        if(old.length>0){
            old.forEach(e => e.classList.replace('color' + currentPlayer + 'pale',"color"+currentPlayer));
        }
        let pieces = document.querySelectorAll("[data-name=\'" + element.getAttribute('data-name') + "\']");
        pieces.forEach(e => e.classList.replace("color"+currentPlayer, "color"+currentPlayer+"pale"));
        setPieceSelected(element.getAttribute('data-name'))
        setPieceId(element.getAttribute('data-name')%1000)
    }
});

document.addEventListener('contextmenu', function(event){
    setRotation(1)
})