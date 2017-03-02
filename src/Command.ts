import { Actor } from './Actor';
import { Map } from './Map';
import { ActorList } from './ActorList';
import * as Point from './Point';
import * as Direction from './Direction';

export interface ActorCommand {
  execute: (actor: Actor, map: Map, actorList:ActorList) => void;
  undo: (actor: Actor, map: Map, actorList:ActorList) => void;
}

export class MovementCommand implements ActorCommand {

  constructor(public readonly direction: Direction.Direction) { }

  public execute(actor: Actor, map: Map, actorList: ActorList) {
    let newPos = Point.moveInDirection(actor.pos, this.direction);
    if (!map.isPassable(newPos.x, newPos.y)) {
      console.log('new space impassable');
      return;
    }
    let target = actorList.actorAtPosition(newPos);
    if (target) {
      console.log('Attack ' + target.actorClass.description);
      actor.attack(target);
      return
    }

    const oldPos = Point.clone(actor.pos);
    actor.setPos(newPos);
    actorList.actorMoved(oldPos, newPos);
  }

  public undo(actor: Actor, map: Map, actorList: ActorList) {
    const reversed = Direction.reverse(this.direction);
    const oldPos = Point.clone(actor.pos);
    const newPos = Point.moveInDirection(oldPos, reversed);
    actor.setPos(newPos);
    actorList.actorMoved(oldPos, newPos);
  }
}
