import { Point } from './Point'
import { Map } from './Map'
import { Direction } from './Command'
import * as ActorClass from './ActorClass'


export class Actor {
  constructor(
    public readonly actorClass: ActorClass.ActorClass,
    public pos: Point
  ) {}

  public moveInDirection(direction: Direction) {
    switch (direction) {
      case Direction.Up:
        return this.moveUp();
      case Direction.Down:
        return this.moveDown();
      case Direction.Left:
        return this.moveLeft();
      case Direction.Right:
        return this.moveRight();
    }
  }

  public moveUp() {
    return this.moveTo(this.pos.x, this.pos.y - 1);
  }

  public moveDown() {
    return this.moveTo(this.pos.x, this.pos.y + 1);
  }

  public moveLeft() {
    return this.moveTo(this.pos.x - 1, this.pos.y)
  }

  public moveRight() {
    return this.moveTo(this.pos.x + 1, this.pos.y);
  }

  public moveTo(x: number, y: number) {
    this.pos = {
      x: x, y: y
    };
    return this;
  }

  public toString() {
    return 'Actor(char=' + this.actorClass.char + ', pos={x:' + this.pos.x + ', y:' + this.pos.y + '}, color=' + this.actorClass.color + ')';
  }

  public static serialize(actor: Actor) {
    return {
      className: actor.actorClass.className,
      pos: actor.pos
    };
  }

  public static deserialize(data: any) {
    if (!data.pos || typeof data.className !== 'string') {
      console.log('bad actor data: ' + data);
      return null;
    }

    // re-establish reference to ActorClass
    let className = <string>data.className;
    let pos = <Point>data.pos;
    let actorClass = ActorClass.getClassByName(className);
    if (!actorClass) {
      console.log('Unknown actor class: ' + className);
      return null;
    }
    return new Actor(actorClass, pos);
  }
}
