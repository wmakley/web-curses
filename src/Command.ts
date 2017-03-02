import { Actor } from './Actor';
import { Map } from './Map';
import { ActorList } from './ActorList';
import * as Point from './Point';

export interface ActorCommand {
  execute: (actor: Actor, map: Map, actorList:ActorList) => void;
  undo: (actor: Actor, map: Map, actorList:ActorList) => void;
}

export enum Direction {
  Up, Down, Left, Right
}


export function reverseDirection(direction: Direction) {
  switch (this.direction) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
    case Direction.Right:
      return Direction.Left;
    default:
      throw 'Unknown direction: ' + this.direction;
  }
}


export class MovementCommand implements ActorCommand {

  constructor(public readonly direction: Direction) { }

  public execute(actor: Actor, map: Map, actorList: ActorList) {
    const oldPos = Point.clone(actor.pos);
    actor.moveInDirection(this.direction);
    if (!map.isPassable(actor.pos.x, actor.pos.y) ||
      actorList.actorAtPosition(actor.pos)) {
      console.log('new space impassable');
      actor.pos = oldPos;
      return;
    }
    actorList.actorMoved(oldPos, actor.pos);
  }

  public undo(actor: Actor, map: Map, actorList: ActorList) {
    const reversed = reverseDirection(this.direction);
    const oldPos = Point.clone(actor.pos);
    actor.moveInDirection(reversed);
    actorList.actorMoved(oldPos, actor.pos);
  }
}
