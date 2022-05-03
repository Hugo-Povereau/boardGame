import {INVALID_MOVE, TurnOrder} from 'boardgame.io/core';
import {
    currentPlayers, currentPlayer, nbPieces, rotation, flip, pieceSelected, isEnded, PieceId,
    nextPlayer, rmPlayer, setPieceId, setPieceSelected, setRotation, setFlip
} from "./const";

export let tour = 0;

export const Blokus = ({
    setup: () => ({cells: Array(400).fill(null)}),

    turn: {
        first: (G, ctx) => 0,
        next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        order: TurnOrder.ONCE,
        minMoves: 1,
        maxMoves: 1,
    },
    moves: {
        clickCell: (G, ctx, id, idPiece) => {
            let diagonale = false;
            if (id === 500) {
                const flag = currentPlayer
                Blokus.switchPlayer(G, ctx);
                rmPlayer(flag);
                return
            }
            for (let i = 0; i < 5; i++) {

                //Les cases sont vides
                if (G.cells[id + initPiece(rotation, flip)[idPiece][i]] !== null) {
                    return INVALID_MOVE;
                }
                //Les cases sont côtes à côtes
                if (i < 4) {
                    if (((id + initPiece(rotation, flip)[idPiece][i]) % 20) === 19 && ((id + initPiece(rotation, flip)[idPiece][i + 1]) % 20) === 0) {
                        return INVALID_MOVE;
                    }
                }
                //Les pièces du currentPlayer ne se touchent pas
                if (G.cells[id + initPiece(rotation, flip)[idPiece][i] + 1] === currentPlayer || G.cells[id + initPiece(rotation, flip)[idPiece][i] - 1] === currentPlayer || G.cells[id + initPiece(rotation, flip)[idPiece][i] + 20] === currentPlayer || G.cells[id + initPiece(rotation, flip)[idPiece][i] - 20] === currentPlayer) {
                    return INVALID_MOVE;
                }
                //Les pièces currentPlayer se touchent au moins une fois en diagonale
                if (G.cells[id + initPiece(rotation, flip)[idPiece][i] + 21] === currentPlayer || G.cells[id + initPiece(rotation, flip)[idPiece][i] - 21] === currentPlayer || G.cells[id + initPiece(rotation, flip)[idPiece][i] + 19] === currentPlayer || G.cells[id + initPiece(rotation, flip)[idPiece][i] - 19] === currentPlayer) {
                    diagonale = true;
                }
            }
            if (tour !== 0 && diagonale === false) {
                return INVALID_MOVE;
            }
            if (tour === 0) {
                let coin = false;
                for (let i = 0; i < 5; i++) {
                    if ([0, 19, 380, 399].includes(id + initPiece(rotation, flip)[idPiece][i])) {
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
                    G.cells[id + initPiece(rotation, flip)[idPiece][i]] = currentPlayer;
                }

                let somme = ((currentPlayer + 1) * 1000 + idPiece);
                let test = document.querySelectorAll(`[data-name=${CSS.escape(somme)}]`);
                test.forEach(div => div.className = 'miniCell');
                test.item(0).attributes.removeNamedItem('data-name');

                nbPieces[currentPlayer] += 1;

                //Changement de couleur des cases
                for (let i = 0; i < 5; i++) {
                    const bloc = id + initPiece(rotation, flip)[idPiece][i];
                    document.querySelector(`[data-id=${CSS.escape(bloc)}]`).classList.add('color' + currentPlayer);
                }
                document.querySelector(`[data-id=\"500\"]`).style.removeProperty('background');

                const flag = currentPlayer
                Blokus.switchPlayer(G, ctx);
                if (nbPieces[currentPlayer] === 21) {
                    rmPlayer(flag);
                }
                return
            }
        },
    },
    endIf: (G, ctx) => {
        if (currentPlayers.length === 0) {

            let max = Math.max.apply(null, nbPieces);
            let GGPlayers = getAllIndexes(nbPieces, max);
            let playersColor = ['Red', 'Blue', 'Yellow', 'Green'];
            for (let i = 4; i--; i >= 0) {
                if (!GGPlayers.includes(i)) {
                    playersColor.splice(i, 1)
                }
            }
            document.getElementById('wrap').style.display = 'none';
            document.getElementById('win').style.display = 'block';

            if (GGPlayers.length > 1) {
                return {draw: playersColor};
            } else {
                document.querySelector(".winner").classList.add(playersColor);
                return {winner: playersColor};
            }
        }
    },
    switchPlayer: (G, ctx) => {
        if (currentPlayers.length > 1) {
            document.getElementById("button").style.removeProperty('background');
            document.querySelector(`[data-id=\"500\"]`).classList.add('color' + currentPlayers[(currentPlayers.indexOf(currentPlayer) + 1) % currentPlayers.length]);
            document.querySelector(`[data-id=\"500\"]`).classList.remove('color' + currentPlayer);
            document.querySelector('#player').classList.add('color' + currentPlayers[(currentPlayers.indexOf(currentPlayer) + 1) % currentPlayers.length]);
            document.querySelector('#player').classList.remove('color' + currentPlayer);
            document.getElementById('player').textContent = "Player " + (currentPlayers[(currentPlayers.indexOf(currentPlayer) + 1) % currentPlayers.length] + 1);
        }

        if (currentPlayers.length !== 0) {
            document.getElementById('piece' + (currentPlayer)).style.display = 'none';
            document.getElementById('piece' + currentPlayers[(currentPlayers.indexOf(currentPlayer) + 1) % currentPlayers.length]).style.display = 'block';

            if (currentPlayer === currentPlayers[currentPlayers.length - 1]) {
                tour += 1;
            }
            let oldPieces = document.getElementById('app').querySelectorAll(".color" + currentPlayer + "pale");
            oldPieces.forEach(e => e.classList.remove("color" + currentPlayer + "pale"));
            setRotation(0);
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
export function initPiece(rotation, flip) {
    //pos de base
    const tab1 = [
        [0, 0, 0, 0, 0],
        [0, 20, 0, 0, 0],
        [0, 20, 40, 0, 0], [0, 20, 21, 0, 0],
        [0, 20, 40, 60, 0], [0, 20, 40, 41, 0], [0, 20, 21, 40, 0], [0, 1, 20, 21, 0], [0, 1, 21, 22, 0],
        [0, 20, 40, 60, 80], [0, 20, 40, 60, 61], [0, 20, 40, 41, 61], [0, 20, 21, 40, 41], [0, 1, 20, 40, 41],
        [0, 20, 21, 40, 60], [0, 1, 2, 21, 41], [0, 20, 40, 41, 42], [0, 1, 21, 22, 42],
        [0, 20, 21, 22, 42], [0, 20, 21, 22, 41], [1, 20, 21, 22, 41]
    ]

    //90° anti horaire
    const tab2 = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 2, 0, 0], [0, 1, -19, 0, 0],
        [0, 1, 2, 3, 0], [0, 1, 2, -18, 0], [0, 1, -19, 2, 0], [0, 1, 20, 21, 0], [0, -20, -19, -39, 0],
        [0, 1, 2, 3, 4], [0, 1, 2, 3, -17], [0, 1, 2, -18, -17], [0, 1, -19, 2, -18], [0, -20, 1, 2, -18],
        [0, 1, -19, 2, 3], [0, -20, -40, -19, -18], [0, 1, 2, -18, -38], [0, -20, -19, -39, -38],
        [0, 1, -19, -39, -38], [0, 1, -19, -18, -39], [1, 20, 21, 22, 41]
    ]

    //180°
    const tab3 = [
        [0, 0, 0, 0, 0],
        [0, 20, 0, 0, 0],
        [0, 20, 40, 0, 0], [0, -20, -21, 0, 0],
        [0, 20, 40, 60, 0], [0, -20, -40, -41, 0], [0, -20, -21, -40, -0], [0, 1, 20, 21, 0], [0, -1, -21, -22, 0],
        [0, 20, 40, 60, 80], [0, -20, -40, -60, -61], [0, -20, -40, -41, -61], [0, -20, -21, -40, -41], [0, -1, -20, -40, -41],
        [0, -20, -21, -40, -60], [0, -1, -2, -21, -41], [0, -20, -40, -41, -42], [0, -1, -21, -22, -42],
        [0, -20, -21, -22, -42], [0, -20, -21, -22, -41], [1, 20, 21, 22, 41]
    ]

    //270°
    const tab4 = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 2, 0, 0], [0, -1, 19, 0, 0],
        [0, 1, 2, 3, 0], [0, -1, -2, 18, 0], [0, -1, 19, -2, 0], [0, 1, 20, 21, 0], [0, 20, 19, 39, 0],
        [0, 1, 2, 3, 4], [0, -1, -2, -3, 17], [0, -1, -2, 18, 17], [0, -1, 19, -2, 18], [0, 20, -1, -2, 18],
        [0, -1, 19, -2, -3], [0, 20, 40, 19, 18], [0, -1, -2, 18, 38], [0, 20, 19, 39, 38],
        [0, -1, 19, 39, 38], [0, -1, 19, 18, 39], [-1, -20, -21, -22, -41]
    ]

    //pos de base mirroir
    const tab5 = [
        [0, 0, 0, 0, 0],
        [0, 20, 0, 0, 0],
        [0, 20, 40, 0, 0], [0, 20, 21, 0, 0],
        [0, 20, 40, 60, 0], [0, 20, 40, 39, 0], [0, 20, 21, 40, 0], [0, 1, 20, 21, 0], [0, 1, -19, -18, 0],
        [0, 20, 40, 60, 80], [0, 20, 40, 60, 59], [0, 20, 40, 39, 59], [0, 20, 19, 40, 39], [0, 1, 20, 40, 41],
        [0, 20, 19, 40, 60], [0, 1, 2, 21, 41], [0, 20, 40, 41, 42], [0, 1, 21, 22, 42],
        [0, 20, 19, 18, 38], [0, 20, 19, 18, 39], [1, 20, 21, 22, 41]
    ]

    //90° anti horaire mirroir
    const tab6 = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 2, 0, 0], [0, 1, -19, 0, 0],
        [0, 1, 2, 3, 0], [0, 1, 2, -20, 0], [0, 1, -19, 2, 0], [0, 1, 20, 21, 0], [0, 20, 21, 41, 0],
        [0, 1, 2, 3, 4], [0, 1, 2, 3, 23], [0, 1, 2, 22, 23], [0, 1, 21, 2, 22], [0, -20, 1, 2, -18],
        [0, 1, 21, 2, 3], [0, -20, -40, -19, -18], [0, 1, 2, -18, -38], [0, -20, -19, -39, -38],
        [0, -1, -21, -41, -42], [0, 1, 21, 41, 22], [1, 20, 21, 22, 41]
    ]

    //180° mirroir
    const tab7 = [
        [0, 0, 0, 0, 0],
        [0, 20, 0, 0, 0],
        [0, 20, 40, 0, 0], [0, -20, -21, 0, 0],
        [0, 20, 40, 60, 0], [0, -20, -40, -39, 0], [0, -20, -21, -40, -0], [0, 1, 20, 21, 0], [0, -1, 19, 18, 0],
        [0, 20, 40, 60, 80], [0, -20, -40, -60, -59], [0, -20, -40, -39, -59], [0, -20, -19, -40, -39], [0, -1, -20, -40, -41],
        [0, -20, -19, -40, -60], [0, -1, -2, -21, -41], [0, -20, -40, -41, -42], [0, -1, -21, -22, -42],
        [0, -20, -19, -18, -38], [0, -20, -19, -18, -39], [1, 20, 21, 22, 41]
    ]

    //270° mirroir
    const tab8 = [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 2, 0, 0], [0, -1, 19, 0, 0],
        [0, 1, 2, 3, 0], [0, -1, -2, 20, 0], [0, -1, 19, -2, 0], [0, 1, 20, 21, 0], [0, -20, -21, -41, 0],
        [0, 1, 2, 3, 4], [0, -1, -2, -3, -23], [0, -1, -2, -22, -23], [0, -1, -21, -2, -22], [0, 20, -1, -2, 18],
        [0, -1, -21, -2, -3], [0, 20, 40, 19, 18], [0, -1, -2, 18, 38], [0, 20, 19, 39, 38],
        [0, 1, 21, 41, 42], [0, -1, -21, -41, -22], [-1, -20, -21, -22, -41]
    ]

    const tab = [tab1, tab2, tab3, tab4]
    const tab_flip = [tab5, tab6, tab7, tab8]
    const tabs = [tab, tab_flip]
    return tabs[flip][rotation];
}

function getAllIndexes(arr, val) {
    let indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) !== -1) {
        indexes.push(i);
    }
    return indexes;
}

document.addEventListener('click', function (event) {
    if (!isEnded) {
        let element = document.elementFromPoint(event.x, event.y);
        if (element.hasAttribute('data-name')) {
            let old = document.querySelectorAll("[data-name=\'" + pieceSelected + "\']");
            if (old.length > 0) {
                old.forEach(e => e.classList.replace('color' + currentPlayer + 'pale', "color" + currentPlayer));
            }
            let pieces = document.querySelectorAll("[data-name=\'" + element.getAttribute('data-name') + "\']");
            pieces.forEach(e => e.classList.replace("color" + currentPlayer, "color" + currentPlayer + "pale"));
            setPieceSelected(element.getAttribute('data-name'))
            setPieceId(element.getAttribute('data-name') % 1000)
        }
    }
});

document.addEventListener('keydown', function (event) {
    if (!isEnded && event.keyCode === 82) {
        setRotation((rotation + 1) % 4)
        //hoverPreview(MouseEvent.prototype.)
        var event = new CustomEvent("mouseover", function (event) {
            hoverPreview(event);
        });
        document.dispatchEvent(event);
    }
    if (!isEnded && event.keyCode === 69) {
        setFlip((flip + 1) % 2)
    }
    if (!isEnded && event.keyCode === 81) {
        Blokus.moves.clickCell(0, 0, 500, PieceId)
        Move();
    }
});

document.addEventListener('contextmenu', function (ev) {
    setFlip((flip + 1) % 2)
}, false);

document.getElementById("app").addEventListener("mouseover", function (event) {
    hoverPreview(event);
});

document.onclick = function (e) {
    if (e.which == 2 && e.target.tagName == 'TR') {
        var loc = e.target.getAttribute('onclick').replace('window.location.href=', '');
        window.location = loc;
        alert("ok");
    }
}

function hoverPreview(event) {
    let oldPieces = document.getElementById('app').querySelectorAll(".color" + currentPlayer + "pale");
    oldPieces.forEach(e => e.classList.remove("color" + currentPlayer + "pale"));
    let element = document.elementFromPoint(event.x, event.y);
    let selected = element.getAttribute("data-id");

    if (typeof pieceSelected !== 'undefined' && selected >= 0 && selected < 500 && !isEnded) {
        let piece = initPiece(rotation, flip)[pieceSelected - ((currentPlayer + 1) * 1000)];

        for (let p in piece) {
            let htmlElement = document.querySelector(`[data-id=${CSS.escape(parseInt(piece[p]) + parseInt(selected))}]`)

            if (Math.abs(((parseInt(selected) + piece[0]) % 20) - ((parseInt(selected) + piece[p]) % 20)) < 10 && !htmlElement.className.toString().includes('color')) {
                htmlElement.classList.add('color' + currentPlayer + 'pale');
            }
        }
    }
}

function Move(G, ctx) {
    nextPlayer()
    ctx.events.moves.clickCell({id: 500, idPiece: PieceId});
    ctx.events.endTurn({next: currentPlayer});
}