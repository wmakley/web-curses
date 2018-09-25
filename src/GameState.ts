import { Map } from './Map';
import { ActorList } from './ActorList';
import { Actor } from './Actor';
import * as Point from './Point';
import { Direction } from './Direction';
import * as Command from './Command';


export enum MovementResult { Impassable, Occupied, Success }


/**
 * Container for all game objects. Designed to be mutated and saved/loaded.
 */
export class GameState {
  public readonly player: Actor;

  constructor(public map: Map, public actorList: ActorList) {
    this.player = actorList.getPlayer();
  }

  /**
   * Prevent trying to load old data that is incompatible with a newer version of the game.
   * Bump whenever the save format changes.
   */
  public static readonly VERSION = "0.3";

  public static serialize(gameState: GameState) {
    return {
      version: GameState.VERSION,
      map: Map.serialize(gameState.map),
      actorList: ActorList.serialize(gameState.actorList)
    }
  }

  public static deserialize(data: any) {
    if (typeof data['version'] === 'undefined' || data.version !== GameState.VERSION) {
      console.log("Game data version mismatch! Saved: " + data.version + ", Current: " + GameState.VERSION);
      return undefined;
    }
    if (typeof data['map'] !== 'object' ||
      typeof data['actorList'] !== 'object') {
      throw "bad GameState data";
    }

    const map = Map.deserialize(data.map);
    const actorList = ActorList.deserialize(data.actorList);

    return new GameState(map, actorList);
  }

  /**
   * Try move an Actor in a direction, returning:
   * [ MovementResult.Impassable, Tile ] when the destination is impassable
   * [ MovementResult.Occupied, Actor ] when there is already in actor in the destination
   * [ MovementResult.Success, true ] on success
   *
   * @param actor
   * @param direction
   */
  public moveActorInDirection(actor: Actor, direction: Direction) {
    const newPos = Point.moveInDirection(actor.pos, direction);
    if (!this.map.isPassable(newPos.x, newPos.y)) {
      return [ MovementResult.Impassable, this.map.tileTypeAt(newPos.x, newPos.y) ];
    }

    let target = this.actorList.actorAtPosition(newPos);
    if (target !== undefined) {
      return [ MovementResult.Occupied, target ];
    }

    const oldPos = Point.clone(actor.pos);
    actor.setPos(newPos);
    this.actorList.actorMoved(oldPos, newPos);

    return [ MovementResult.Success, oldPos ];
  }

  /**
   * Unsafely move an actor to a point, regardless of whether that point is valid.
   * @param actor
   * @param point
   */
  public unsafelyMoveActorToPoint(actor: Actor, point: Point.Point) {
    const oldPos = actor.pos;
    actor.setPos(point);
    this.actorList.actorMoved(oldPos, point);
  }

  public combat(actor: Actor, target: Actor) {
    this.showMessage("You attack the " + target.type.name + "!");
  }

  /**
   * Append a message to the player's message log.
   * @param message
   */
  public showMessage(message: string) {
    console.log(message);
  }

  public wait(turns: number) {
    if (turns <= 0) return;
    for (let i = 0; i < turns; i += 1) {
      this.endPlayerTurn();
    }
  }

  public endPlayerTurn() {
    this.updateAllActors();
  }

  private updateAllActors() {
    this.actorList.forEach((actor) => {
      const commands = actor.update(this);
      if (commands !== undefined) {
        commands.forEach(this.executeCommand, this);
      }
    });
  }

  private executeCommand(command: Command.Command) {
    command.execute(this);
  }
}
