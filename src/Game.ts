import { GameRenderer } from './GameRenderer';
import { GameState } from './GameState';
import Entity from './Entity';
import * as EntityType from './EntityType';
import EntityList from './EntityList';
import { Map } from './Map';
import * as Keyboard from './Keyboard';
import * as Command from './Command';
import { Direction } from './Direction';
import { Storage } from './Storage';


export interface Config {
  canvas: HTMLCanvasElement
  debug: boolean
  fontSize: number
  fontFace?: string
}

/**
 * Main entry point. Owns all objects.
 */
export class Game {
  public debug: boolean;

  private renderer: GameRenderer;
  private storage: Storage;
  private eventHandler: Keyboard.EventHandler;

  private state: GameState;

  constructor(
    private readonly config: Config
  ) {
    this.debug = config.debug;

    this.renderer = new GameRenderer(config.canvas, config.fontSize, config.fontFace);

    if (this.debug) {
      console.log('Font: ' + config.fontSize + 'px ' + (config.fontFace || '') + '; ' + this.renderer.getHorizontalTiles() + ' tiles x ' + this.renderer.getVerticalTiles() + ' tiles');
    }

    this.storage = new Storage();
    if (!this.loadGame()) {
      this.startNewGame();
    }

    const player = this.state.player;
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
    // TODO: the map width could actually be different from the screen!
    const width = 1000,
      height = 1000;
    const map = new Map(width, height);
    map.genPerlin();
    const entityList = new EntityList(width, height);
    const player = new Entity(EntityType.Player, { x: 10, y: 10 }, 10);
    entityList.addEntity(player);
    entityList.addEntity(new Entity(EntityType.HugeHollow, { x: 12, y: 12 }, 20));
    this.state = new GameState(map, entityList);
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
