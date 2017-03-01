import { Game } from './Game'

document.addEventListener('DOMContentLoaded', function (event) {
  let canvas = <HTMLCanvasElement>document.getElementById('canvas');
  let fontSize = parseInt(canvas.dataset['fontSize']);
  let fontFace = canvas.dataset['fontFace'];
  let game = new Game(canvas, fontSize, fontFace);
  (<any>window)['Game'] = game;

  // window.onbeforeunload = function (event) {
  //   game.saveGame();
  // };

  document.getElementById('save-button').addEventListener('click', function (event) {
    game.saveGame();
  });

  document.getElementById('load-button').addEventListener('click', function (event) {
    game.loadGame();
  });

  document.getElementById('delete-button').addEventListener('click', function (event) {
    game.deleteGame();
  });
});