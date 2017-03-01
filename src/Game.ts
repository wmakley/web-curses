import { WebCurses } from './WebCurses';
import { Entity } from './Entity';
import { Map } from './Map';
import { Tile } from './Tile';
import * as Keyboard from './Keyboard';
import { EntityCommand, MovementCommand, Direction } from './Command';
import { Storage } from './Storage';

export class Game {
  public debug: boolean;

  private screen: WebCurses;

  private map: Map;
  private player: Entity;
  private storage: Storage;

  constructor(
    private canvas: HTMLCanvasElement,
    public readonly fontSize: number,
    public readonly fontFace?: string
  ) {
    this.debug = canvas.dataset['debug'] === 'true';
    this.screen = new WebCurses(canvas, fontSize, fontFace);
    if (this.debug) console.log('Font: ' + fontSize + 'px ' + (fontFace || '') + '; ' + this.screen.horizontalTiles + ' tiles x ' + this.screen.verticalTiles + ' tiles');

    this.storage = new Storage();
    if (!this.loadGame()) {
      this.player = new Entity({ x: 10, y: 10 }, '@', '#FFFFFF');
      this.map = new Map(this.screen.horizontalTiles, this.screen.verticalTiles);
      this.drawFrame();
    }

    const moveUpCommand = new MovementCommand(Direction.Up);
    const moveDownCommand = new MovementCommand(Direction.Down);
    const moveLeftCommand = new MovementCommand(Direction.Left);
    const moveRightCommand = new MovementCommand(Direction.Right);

    let playerCommandMappings: { [key: string]: EntityCommand } = {
      'ArrowUp': moveUpCommand,
      'k': moveUpCommand,
      'ArrowDown': moveDownCommand,
      'j': moveDownCommand,
      'ArrowLeft': moveLeftCommand,
      'h': moveLeftCommand,
      'ArrowRight': moveRightCommand,
      'l': moveRightCommand
    };

    window.addEventListener('keydown', (event) => {
      let key = Keyboard.getKey(event);
      if (key === null) return;
      if (this.debug) console.log("keydown : '" + key + "'");
      let command = playerCommandMappings[key];
      if (command) {
        event.preventDefault();
        this.player = command.execute(this.player, this.map);
        this.drawFrame();
      }
    });
  }

  public saveGame() {
    this.storage.saveMap('main', this.map);
    this.storage.saveEntity('player', this.player);
  }

  public loadGame() {
    let player = this.storage.loadEntity('player');
    if (!player) return false;
    let map = this.storage.loadMap('main');
    if (!map) return false;
    this.player = player;
    this.map = map;
    this.drawFrame();
    return true;
  }

  public deleteGame() {
    return this.storage.clear();
  }

  public drawFrame() {
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