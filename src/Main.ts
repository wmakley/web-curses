import { Game } from './Game'

document.addEventListener('DOMContentLoaded', function (event) {
  let canvas = <HTMLCanvasElement>document.getElementById('canvas');
  let fontSize = parseInt(canvas.dataset['fontSize']);
  window['Game'] = new Game(canvas, fontSize);
});