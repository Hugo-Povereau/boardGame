import {Client} from 'boardgame.io/client';
import {Blokus, initPiece} from './Game';
import {PieceId} from "./const";
class BlokusClient {

    constructor(rootElement, {playerID} = {}) {
        this.client = Client({
            game: Blokus,
            numPlayers:4,
            playerID,
            debug: false,
        });
        this.client.start();
        this.rootElement = rootElement;
        this.createBoard();
        this.attachListeners();
        this.client.subscribe(state => this.update(state));
    }

    //Creation du plateau
    createBoard() {
        const rows = [];
        for (let i = 0; i < 20; i++) {
            const cells = [];
            for (let j = 0; j < 20; j++) {
                const id = 20 * i + j;
                cells.push(`<td class="cell" data-id="${id}"></td>`);
            }
            rows.push(`<tr>${cells.join('')}</tr>`);
        }
        this.rootElement.innerHTML = `
      <table>${rows.join('')}</table>
      <table><td class="cell" data-id="500" id="button">giveup</td></table>
      <p class="winner"></p>
    `;
    }

    //Interaction souris-plateau
    attachListeners() {
        // This event handler will read the cell id from a cell’s
        // `data-id` attribute and make the `clickCell` move.
        const handleCellClick = event => {
            const id = parseInt(event.target.dataset.id);
            const piece = parseInt(PieceId);
            this.client.moves.clickCell(id,piece);
        };
        // Attach the event listener to each of the board cells.
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.onclick = handleCellClick;
        });
    }

    //Maj des cases si positionnement valide
    update(state) {
        // Get the gameover message element.
        const messageEl = this.rootElement.querySelector('.winner');
        // Update the element to show a winner if any.
        if (state.ctx.gameover) {
            messageEl.textContent =
                state.ctx.gameover.winner !== undefined
                    ? 'Winner: Player ' + state.ctx.gameover.winner
                    : 'Draw!';
        } else {
            messageEl.textContent = '';
        }
    }
}

class pieceBoard {
    constructor(pieceElements) {
        for (let i=0; i<pieceElements.length; i++) { // remplacer par (pieceElement in PieceElements)
            this.pieceElement = pieceElements[i];
            this.createBoard(i);
        }
    }
    createBoard(player) {
        const rows = [];
        for (let i = 0; i < 28; i++) {
            const cells = [];
            for (let j = 0; j < 14; j++) {
                const id = 1000 * (player + 1) + 14 * i + j;
                cells.push(`<td class="miniCell" data-id="${id}"></td>`);
            }
            rows.push(`<tr>${cells.join('')}</tr>`);
        }

        this.pieceElement.innerHTML = `
      <table class="pieceTable">${rows.join('')}</table>
    `;

        const tab_piece = [0, 28, 70, 72, 126, 128, 131, 134, 137, 196, 198, 201, 204, 207, 280, 283, 287, 290, 350, 354, 358];

        for (let i = 0; i < 21; i++) {
            for (let j = 0; j < 5; j++) {
                document.querySelector(`[data-id=${CSS.escape((1000 * (player + 1)) + (Math.floor(initPiece()[i][j] / 20) * 14 + (initPiece()[i][j] % 20) + tab_piece[i]))}]`).classList.add('color' + player);
            }
        }
        //if ne fonctionne pas
        if (cell === classList.contains('color' + player)) {
            classList.replace((miniCell + 'color' + player), miniCell)
        }
    }

}

class giveUp {
    constructor(giveUpElement) {// remplacer par (pieceElement in PieceElements)
        this.giveUpElement = giveUpElement;
        this.createButtonDiv();
    }
    createButtonDiv(){
        cells.push(`<td class="cell" data-id="500"></td>`);
    }

}

const appElement = document.getElementById('app');
const pieceElements = document.getElementsByClassName('pieces');
const giveUpElement = document.getElementById('give_up');
const app = new BlokusClient(appElement);
const piece = new pieceBoard(pieceElements);
const button = new giveUp(giveUpElement);
