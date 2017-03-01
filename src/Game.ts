import { WebCurses } from './WebCurses';
import { Entity } from './Entity';
import { Map } from './Map';
import { Tile } from './Tile';
import * as Keyboard from './Keyboard';

export class Game {
  public debug: boolean;

  private screen: WebCurses;

  private map: Map;
  private player: Entity;

  constructor(private canvas: HTMLCanvasElement, public readonly fontSize: number) {
    this.debug = canvas.dataset['debug'] === 'true';
    let fontFace = canvas.dataset['fontFace'];
    this.screen = new WebCurses(canvas, fontSize, fontFace);
    if (this.debug) console.log('font size: ' + fontSize + '; ' + this.screen.horizontalTiles + ' tiles x ' + this.screen.verticalTiles + ' tiles');
    this.player = new Entity({ x: 10, y: 10 }, '@', '#FFFFFF');
    this.map = new Map(this.screen.horizontalTiles, this.screen.verticalTiles);

    window.addEventListener('keydown', (event) => {
      let key = Keyboard.getKey(event);
      if (key === null) return;
      if (this.debug) console.log("keydown : '" + key + "'");
      switch (key) {
        case 'ArrowUp':
        case 'k':
          event.preventDefault();
          if (this.player.moveUp(this.map))
            this.drawFrame();
          break;
        case 'ArrowDown':
        case 'j':
          event.preventDefault();
          if (this.player.moveDown(this.map))
            this.drawFrame();
          break;
        case 'ArrowLeft':
        case 'h':
          event.preventDefault();
          if (this.player.moveLeft(this.map))
            this.drawFrame();
          break;
        case 'ArrowRight':
        case 'l':
          event.preventDefault();
          if (this.player.moveRight(this.map))
            this.drawFrame();
          break;
      }
    });

    this.drawFrame();
  }

  private drawFrame() {
    this.drawBackground();
    this.drawEntity(this.player);
    this.screen.putChar('D', 12, 13, '#FF0000', '#000000');
  }

  private drawBackground() {
    this.screen.clear('#000000');
    this.map.eachTile((x: number, y: number, tile: Tile) => {
      var tileType = tile.type;
      this.screen.putChar(tileType.char, x, y, tileType.color, tileType.bgColor);
    });
  }

  private drawEntity(entity: Entity) {
    let x = entity.pos.x;
    let y = entity.pos.y;
    this.screen.putChar(entity.char, x, y, entity.color, '#000000');
  }
}