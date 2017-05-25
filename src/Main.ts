import { Game } from './Game'

document.addEventListener('DOMContentLoaded', function (event) {

  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const fontSize = parseInt(canvas.dataset['fontSize']);
  const fontFace = canvas.dataset['fontFace'];

  const game = new Game(canvas, fontSize, fontFace);
  (<any>window)['Game'] = game;



  // window.onbeforeunload = function (event) {
  //   game.saveGame();
  // };

  function hide(element: HTMLElement) {
    element.style.display = 'none';
    element.style.visibility = 'hidden';
  }

  function show(element: HTMLElement) {
    element.style.display = '';
    element.style.visibility = 'visible';
  }


  const saveButton = document.getElementById('save-button');
  const loadButton = document.getElementById('load-button');
  const deleteButton = document.getElementById('delete-button');

  if (game.saveExists()) {
    show(deleteButton);
    show(loadButton);
  } else {
    hide(deleteButton);
    hide(loadButton);
  }

  saveButton.addEventListener('click', function (event) {
    if (game.saveGame()) {
      show(deleteButton);
      show(loadButton);
    }
  });

  loadButton.addEventListener('click', function (event) {
    game.loadGame();
  });

  deleteButton.addEventListener('click', function (event) {
    if (game.deleteGame()) {
      hide(deleteButton);
      hide(loadButton);
    }
  });
});
