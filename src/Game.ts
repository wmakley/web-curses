import { WebCurses } from './WebCurses';
import { Actor } from './Actor';
import * as ActorClass from './ActorClass';
import { ActorList } from './ActorList';
import { Map } from './Map';
import { Tile } from './Tile';
import * as Keyboard from './Keyboard';
import { ActorCommand, MovementCommand } from './Command';
import { Direction } from './Direction';
import { Storage } from './Storage';

export interface Config {
  canvas: HTMLCanvasElement
  fontSize: number
  fontFace?: string
}

export class Game {
  public debug: boolean;

  private screen: WebCurses;
  private storage: Storage;
  private eventHandler: Keyboard.EventHandler;

  public map: Map;
  public actorList: ActorList;
  private player: Actor;

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
      this.startNewGame();
    }

    const moveUpCommand = new MovementCommand(Direction.Up);
    const moveDownCommand = new MovementCommand(Direction.Down);
    const moveLeftCommand = new MovementCommand(Direction.Left);
    const moveRightCommand = new MovementCommand(Direction.Right);
    const moveNWCommand = new MovementCommand(Direction.NW);
    const moveNECommand = new MovementCommand(Direction.NE);
    const moveSWCommand = new MovementCommand(Direction.SW);
    const moveSECommand = new MovementCommand(Direction.SE);

    const playerCommandMappings: { [key: string]: ActorCommand } = {
      'ArrowUp': moveUpCommand,
      'k': moveUpCommand,
      'ArrowDown': moveDownCommand,
      'j': moveDownCommand,
      'ArrowLeft': moveLeftCommand,
      'h': moveLeftCommand,
      'ArrowRight': moveRightCommand,
      'l': moveRightCommand,
      'y': moveNWCommand,
      'u': moveNECommand,
      'b': moveSWCommand,
      'n': moveSECommand
    };

    this.eventHandler = Keyboard.createEventHandler(
      window,
      playerCommandMappings,
      (command: ActorCommand) => {
        command.execute(this.player, this);
        this.drawFrame();
      }
    );
  }

  public saveGame(name = 'main') {
    this.storage.saveMap(name, this.map);
    this.storage.saveActorList(name, this.actorList);
    return true;
  }

  public loadGame(name = 'main') {
    const map = this.storage.loadMap(name);
    if (map === undefined) {
      console.log('no map, starting new game');
      return false;
    }
    const actorList = this.storage.loadActorList(name);
    if (actorList === undefined) {
      console.log('no actor list, starting new game');
      return false;
    }
    this.player = actorList.get(0);
    if (this.player === undefined) {
      console.log('no player, starting new game');
      return false;
    }
    this.map = map;
    this.actorList = actorList;
    this.drawFrame();
    return true;
  }

  public startNewGame() {
    this.storage.clear();
    this.map = new Map(this.screen.horizontalTiles, this.screen.verticalTiles);
    this.actorList = new ActorList(this.screen.horizontalTiles, this.screen.verticalTiles);
    this.player = new Actor(ActorClass.Player, { x: 10, y: 10 }, 10);
    this.actorList.addActor(this.player);
    this.actorList.addActor(new Actor(ActorClass.HugeHollow, {x: 12, y: 12 }, 20));
    this.drawFrame();
    return true;
  }

  public deleteGame() {
    return this.storage.clear();
  }

  public saveExists() {
    return this.storage.dataExists('main');
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
    const actorClass = actor.actorClass;
    const x = actor.pos.x;
    const y = actor.pos.y;
    this.screen.putChar(actorClass.char, x, y, actorClass.color, '#000000');
  }

  public static serialize(game: Game) {
    return {
      map: Map.serialize(game.map),
      actorList: ActorList.serialize(game.actorList)
    };
  }

  public static deserialize(data: any, config: Config) {
    if (typeof data['map'] !== 'object' ||
      typeof data['actorList'] !== 'object') {
      throw "bad game data!";
    }

    const map = Map.deserialize(data.map);
    const actorList = ActorList.deserialize(data.actorList);

    let game = new Game(config.canvas, config.fontSize, config.fontFace);
    // TODO: allow passing a raw map and actor list into a Game
  }
}
