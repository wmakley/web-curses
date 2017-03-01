import { Entity } from './Entity';
import { Map } from './Map';

export interface EntityCommand {
  execute: (entity: Entity, map: Map) => Entity;
  undo: (entity: Entity) => Entity;
}

export enum Direction {
  Up, Down, Left, Right
}

export class MovementCommand implements EntityCommand {

  constructor(public readonly direction: Direction) { }

  public execute(entity: Entity, map: Map) {
    let moved = entity.moveInDirection(this.direction);
    if (map.isPassable(moved.pos.x, moved.pos.y)) {
      return moved;
    }
    return entity;
  }

  public undo(entity: Entity) {
    switch (this.direction) {
      case Direction.Up:
        return entity.moveDown();
      case Direction.Down:
        return entity.moveUp();
      case Direction.Left:
        return entity.moveLeft();
      case Direction.Right:
        return entity.moveRight();
    }
  }
}