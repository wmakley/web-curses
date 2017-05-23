import { WebCurses } from './WebCurses';
import { GameRenderer } from './GameRenderer';
import { Actor } from './Actor';
import * as ActorClass from './ActorClass';
import { ActorList } from './ActorList';
import { Map } from './Map';
import { Tile } from './Tile';
import * as Keyboard from './Keyboard';
import { ActorCommand, MovementCommand } from './Command';
import { Direction } from './Direction';
import { Storage } from './Storage';


/**
 * Main entry point. Owns all objects, and provides an API
 * for manipulating state that AI and player interaction
 * code can call into.
 */
export class Game {
  public debug: boolean;

  private term: WebCurses;
  private renderer: GameRenderer;
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

    this.term = new WebCurses(canvas, fontSize, fontFace);
    this.renderer = new GameRenderer(this.term);

    if (this.debug) console.log('Font: ' + fontSize + 'px ' + (fontFace || '') + '; ' + this.term.horizontalTiles + ' tiles x ' + this.term.verticalTiles + ' tiles');

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
        this.updateDisplay();
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
    this.updateDisplay();
    return true;
  }

  public startNewGame() {
    this.storage.clear();
    this.map = new Map(this.term.horizontalTiles, this.term.verticalTiles);
    this.actorList = new ActorList(this.term.horizontalTiles, this.term.verticalTiles);
    this.player = new Actor(ActorClass.Player, { x: 10, y: 10 }, 10);
    this.actorList.addActor(this.player);
    this.actorList.addActor(new Actor(ActorClass.HugeHollow, {x: 12, y: 12 }, 20));
    this.updateDisplay();
    return true;
  }

  public deleteGame() {
    return this.storage.clear();
  }

  public saveExists() {
    return this.storage.dataExists('main');
  }

  private updateDisplay() {
    this.renderer.update(this.map, this.actorList);
  }
}
