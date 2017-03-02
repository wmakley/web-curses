import { WebCurses } from './WebCurses';
import { Actor } from './Actor';
import { ActorList } from './ActorList';
import { Map } from './Map';
import { Tile } from './Tile';
import * as Keyboard from './Keyboard';
import { ActorCommand, MovementCommand, Direction } from './Command';
import { Storage } from './Storage';

export class Game {
  public debug: boolean;

  private screen: WebCurses;

  private map: Map;
  private actorList: ActorList;
  private player: Actor;
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
      this.storage.clear();
      this.map = new Map(this.screen.horizontalTiles, this.screen.verticalTiles);
      this.actorList = new ActorList(this.screen.horizontalTiles, this.screen.verticalTiles);
      this.player = new Actor({ x: 10, y: 10 }, '@', '#FFFFFF');
      this.actorList.addActor(this.player);
      this.actorList.addActor(new Actor({x: 12, y: 12 }, 'D', '#FF2222'));
      this.drawFrame();
    }

    const moveUpCommand = new MovementCommand(Direction.Up);
    const moveDownCommand = new MovementCommand(Direction.Down);
    const moveLeftCommand = new MovementCommand(Direction.Left);
    const moveRightCommand = new MovementCommand(Direction.Right);

    let playerCommandMappings: { [key: string]: ActorCommand } = {
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
      // if (this.debug) console.log("keydown : '" + key + "'");
      let command = playerCommandMappings[key];
      if (command) {
        event.preventDefault();
        command.execute(this.player, this.map, this.actorList);
        this.drawFrame();
      }
    });
  }

  public saveGame() {
    this.storage.saveMap('main', this.map);
    this.storage.saveActorList('main', this.actorList);
  }

  public loadGame() {
    let map = this.storage.loadMap('main');
    if (!map) {
      console.log('no map, starting new game');
      return false;
    }
    let actorList = this.storage.loadActorList('main');
    if (!actorList) {
      console.log('no actor list, starting new game');
      return false;
    }
    this.player = actorList.get(0);
    if (!this.player) {
      console.log('no player, starting new game');
      return false;
    }
    this.map = map;
    this.actorList = actorList;
    this.drawFrame();
    return true;
  }

  public deleteGame() {
    return this.storage.clear();
  }

  public drawFrame() {
    this.drawBackground();
    this.actorList.forEach((actor) => {
      // console.log('draw actor: ' + actor.toString());
      this.drawActor(actor);
    });
  }

  private drawBackground() {
    this.screen.clear('#000000');
    this.map.eachTile((x: number, y: number, tile: Tile) => {
      var tileType = tile.type;
      this.screen.putChar(tileType.char, x, y, tileType.color, tileType.bgColor);
    });
  }

  private drawActor(actor: Actor) {
    let x = actor.pos.x;
    let y = actor.pos.y;
    this.screen.putChar(actor.char, x, y, actor.color, '#000000');
  }
}
