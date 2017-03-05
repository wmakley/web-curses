import { Point } from './Point'
import { Map } from './Map'
import * as ActorClass from './ActorClass'


export class Actor {
  constructor(
    public readonly actorClass: ActorClass.ActorClass,
    public pos: Point,
    public hp: number
  ) {}

  public setPos(pos: Point) {
    this.pos = pos;
  }

  public attack(other: Actor) {
    console.log('You attack the ' + other.actorClass.name + '!');
  }

  public toString() {
    return 'Actor(char=' + this.actorClass.char + ', pos={x:' + this.pos.x + ', y:' + this.pos.y + '}, color=' + this.actorClass.color + ')';
  }

  public static serialize(actor: Actor) {
    let clone = <any>{};
    for (let key in actor) {
      if (!actor.hasOwnProperty(key)) continue;
      if (key === 'actorClass') {
        clone.className = actor.actorClass.className;
      } else {
        clone[key] = (<any>actor)[key];
      }
    }
    return clone;
  }

  public static deserialize(data: any) {
    if (!data.pos || typeof data.className !== 'string' || typeof data.hp !== 'number') {
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
    return new Actor(actorClass, pos, data.hp);
  }
}
