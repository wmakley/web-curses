import Entity from './Entity';
import { TileType } from './TileType';
import { GameState, MovementResult } from './GameState';
import * as Point from './Point';
import * as Direction from './Direction';

export interface Command {
  execute: (game: GameState) => void;
  undo: (game: GameState) => void;
}

export class PlayerMovement implements Command {

  constructor(private player: Entity, private direction: Direction.Direction) {
  }

  private oldPos: Point.Point;

  public toString() {
    return "<PlayerMovement actor:Player direction:" + Direction.description(this.direction) + ">";
  }

  public execute(game: GameState) {
    const [result, arg] = game.moveEntityInDirection(this.player, this.direction);
    if (result === MovementResult.Impassable) {
      // don't end the turn, just show the message
      this.oldPos = this.player.pos;
      const tileType = <TileType>arg;
      game.showMessage("You hit your head on the " + tileType.description + ".");
    }
    else if (result === MovementResult.Occupied) {
      this.oldPos = this.player.pos;
      game.combat(this.player, <Entity>arg);
      game.endPlayerTurn();
    }
    else {
      // if success, just record the previous position and end the turn
      this.oldPos = <Point.Point>arg;
      game.endPlayerTurn();
    }
  }

  public undo(game: GameState) {
    game.unsafelyMoveEntityToPoint(this.player, this.oldPos);
  }
}

export class ShowMessage implements Command {
  constructor(private message: string) { }

  public execute(game: GameState) {
    game.showMessage(this.message);
  }

  public undo(game: GameState) { }
}
