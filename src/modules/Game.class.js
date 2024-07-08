'use strict';

const { gameStatus } = require('../constants/gameStatus');
const {
  default: addNewNumToState,
} = require('../scripts/components/addNewNum');
const { default: initialState } = require('../scripts/components/initialState');
const { default: moveDown } = require('../scripts/components/moveDown');
const { default: moveLeft } = require('../scripts/components/moveLeft');
const { default: moveRight } = require('../scripts/components/moveRight');
const { default: moveUp } = require('../scripts/components/moveUp');
const { default: renderNums } = require('../scripts/components/renderNums');

class Game {
  state = [];
  status = gameStatus.idle;

  constructor(data) {
    this.state = data;
  }

  moveLeft() {
    if (this.getStatus() !== gameStatus.playing) {
      return;
    }

    const afterMove = moveLeft(this.getState());

    this.applyChanges(afterMove);
  }

  moveRight() {
    if (this.getStatus() !== gameStatus.playing) {
      return;
    }

    const afterMove = moveRight(this.getState());

    this.applyChanges(afterMove);
  }

  moveUp() {
    if (this.getStatus() !== gameStatus.playing) {
      return;
    }

    const afterMove = moveUp(this.getState());

    this.applyChanges(afterMove);
  }

  moveDown() {
    if (this.getStatus() !== gameStatus.playing) {
      return;
    }

    const afterMove = moveDown(this.getState());

    this.applyChanges(afterMove);
  }

  getScore() {
    if (this.status === gameStatus.idle) {
      return 0;
    }

    return this.state.flat().reduce((acc, elem) => acc + elem, 0);
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = gameStatus.playing;
    renderNums(this.getState());
  }

  restart() {
    this.state = initialState();
    renderNums(this.getState());
    this.status = gameStatus.playing;

    document.querySelectorAll('.message').forEach((message) => {
      if (!message.classList.contains('hidden')) {
        message.classList.add('hidden');
      }
    });
  }

  async applyChanges(afterMove) {
    const full = await this.isFull(afterMove);

    if (full) {
      this.gameOver();

      return;
    }

    if (!afterMove) {
      return;
    }

    const newState = addNewNumToState(afterMove);

    this.state = newState;
    renderNums(newState);

    if (this.has2048(this.state)) {
      this.winner();
    }
  }

  isFull(afterMove) {
    if (!afterMove) {
      return new Promise((resolve, reject) => {
        const right = moveRight(this.getState());

        if (right) {
          return false;
        }

        resolve();
      })
        .then(() => {
          const left = moveLeft(this.getState());

          if (left) {
            return false;
          }
        })
        .then(() => {
          const up = moveUp(this.getState());

          if (up) {
            return false;
          }
        })
        .then(() => {
          const down = moveDown(this.getState());

          if (down) {
            return false;
          }

          return true;
        });
    }
  }

  gameOver() {
    this.status = gameStatus.lose;
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  has2048(afterMove) {
    return afterMove.flat().includes(2048);
  }

  winner() {
    this.status = gameStatus.win;
    document.querySelector('.message-win').classList.remove('hidden');
  }
}

module.exports = Game;
