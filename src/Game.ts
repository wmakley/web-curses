import { WebCurses } from './WebCurses';
import { GameRenderer } from './GameRenderer';
import { GameState } from './GameState';
import { Actor } from './Actor';
import * as ActorClass from './ActorClass';
import { ActorList } from './ActorList';
import { Map } from './Map';
import { Tile } from './Tile';
import * as Keyboard from './Keyboard';
import * as Command from './Command';
import { Direction } from './Direction';
import { Storage } from './Storage';
import * as Point from './Point';


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

  private state: GameState;

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

    let player = this.state.player;
    const moveUpCommand = new Command.PlayerMovement(player, Direction.Up);
    const moveDownCommand = new Command.PlayerMovement(player, Direction.Down);
    const moveLeftCommand = new Command.PlayerMovement(player, Direction.Left);
    const moveRightCommand = new Command.PlayerMovement(player, Direction.Right);
    const moveNWCommand = new Command.PlayerMovement(player, Direction.NW);
    const moveNECommand = new Command.PlayerMovement(player, Direction.NE);
    const moveSWCommand = new Command.PlayerMovement(player, Direction.SW);
    const moveSECommand = new Command.PlayerMovement(player, Direction.SE);

    const playerCommandMappings: { [key: string]: Command.Command } = {
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
      (command: Command.Command) => {
        command.execute(this.state);
        this.updateDisplay();
      }
    );
  }

  public saveGame(name = 'main') {
    this.storage.saveGame(name, this.state);
    return true;
  }

  public loadGame(name = 'main') {
    this.state = this.storage.loadGame(name);
    if (!this.state) {
      console.log('bad save data, starting new game');
      return false;
    }
    this.updateDisplay();
    return true;
  }

  public startNewGame() {
    this.storage.clear();
    const map = new Map(this.term.horizontalTiles, this.term.verticalTiles);
    const actorList = new ActorList(this.term.horizontalTiles, this.term.verticalTiles);
    const player = new Actor(ActorClass.Player, { x: 10, y: 10 }, 10);
    actorList.addActor(player);
    actorList.addActor(new Actor(ActorClass.HugeHollow, { x: 12, y: 12 }, 20));
    this.state = new GameState(map, actorList);
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
    this.renderer.update(this.state);
  }
}
