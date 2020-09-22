import { Map } from './Map';
import EntityList from './EntityList';
import Entity from './Entity';
import * as Point from './Point';
import { Direction } from './Direction';
import * as Command from './Command';


export enum MovementResult { Impassable, Occupied, Success }


/**
 * Container for all game objects. Designed to be mutated and saved/loaded.
 */
export class GameState {
  public readonly player: Entity;

  constructor(public map: Map, public entityList: EntityList) {
    this.player = entityList.getPlayer();
  }

  /**
   * Prevent trying to load old data that is incompatible with a newer version of the game.
   * Bump whenever the save format changes.
   */
  public static readonly VERSION = "0.4";

  public static serialize(gameState: GameState) {
    return {
      version: GameState.VERSION,
      map: Map.serialize(gameState.map),
      entityList: EntityList.serialize(gameState.entityList)
    }
  }

  public static deserialize(data: any) {
    if (typeof data['version'] === 'undefined' || data.version !== GameState.VERSION) {
      console.log("Game data version mismatch! Saved: " + data.version + ", Current: " + GameState.VERSION);
      return undefined;
    }
    if (typeof data['map'] !== 'object' ||
      typeof data['entityList'] !== 'object') {
      throw "bad GameState data";
    }

    const map = Map.deserialize(data.map);
    const entityList = EntityList.deserialize(data.entityList);

    return new GameState(map, entityList);
  }

  /**
   * Try move an Entity in a direction, returning:
   * [ MovementResult.Impassable, Tile ] when the destination is impassable
   * [ MovementResult.Occupied, Entity ] when there is already in entity in the destination
   * [ MovementResult.Success, true ] on success
   *
   * @param entity
   * @param direction
   */
  public moveEntityInDirection(entity: Entity, direction: Direction) {
    const newPos = Point.moveInDirection(entity.pos, direction);
    if (!this.map.isPassable(newPos.x, newPos.y)) {
      return [MovementResult.Impassable, this.map.tileTypeAt(newPos.x, newPos.y)];
    }

    let target = this.entityList.entityAtPosition(newPos);
    if (target !== undefined) {
      return [MovementResult.Occupied, target];
    }

    const oldPos = Point.clone(entity.pos);
    entity.setPos(newPos);
    this.entityList.entityMoved(oldPos, newPos);

    return [MovementResult.Success, oldPos];
  }

  /**
   * Unsafely move an entity to a point, regardless of whether that point is valid.
   * @param entity
   * @param point
   */
  public unsafelyMoveEntityToPoint(entity: Entity, point: Point.Point) {
    const oldPos = entity.pos;
    entity.setPos(point);
    this.entityList.entityMoved(oldPos, point);
  }

  public combat(entity: Entity, target: Entity) {
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
    this.updateAllEntities();
  }

  private updateAllEntities() {
    this.entityList.forEach((entity) => {
      const commands = entity.update(this);
      if (commands !== undefined) {
        commands.forEach(this.executeCommand, this);
      }
    });
  }

  private executeCommand(command: Command.Command) {
    command.execute(this);
  }
}
