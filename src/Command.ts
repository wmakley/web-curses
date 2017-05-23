import { Actor } from './Actor';
import { Game } from './Game';
import * as Point from './Point';
import * as Direction from './Direction';

export interface ActorCommand {
  execute: (actor: Actor, game: Game) => void;
  undo: (actor: Actor, game: Game) => void;
}

export class MovementCommand implements ActorCommand {

  constructor(public readonly direction: Direction.Direction) { }

  public execute(actor: Actor, game: Game) {
    let newPos = Point.moveInDirection(actor.pos, this.direction);
    let map = game.map;
    let actorList = game.actorList;
    if (!map.isPassable(newPos.x, newPos.y)) {
      console.log('new space impassable');
      return;
    }
    let target = actorList.actorAtPosition(newPos);
    if (target) {
      actor.attack(target);
      return
    }

    const oldPos = Point.clone(actor.pos);
    actor.setPos(newPos);
    actorList.actorMoved(oldPos, newPos);
  }

  public undo(actor: Actor, game: Game) {
    const reversed = Direction.reverse(this.direction);
    const oldPos = Point.clone(actor.pos);
    const newPos = Point.moveInDirection(oldPos, reversed);
    const actorList = game.actorList;
    actor.setPos(newPos);
    actorList.actorMoved(oldPos, newPos);
  }
}


export class AttackCommand implements ActorCommand {

  constructor(public readonly target: Actor) { }

  public execute(attacker: Actor, game: Game) {
  }

  public undo(attacker: Actor, game: Game) {
  }
}
