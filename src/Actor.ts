import { Point } from './Point'
import { Map } from './Map'
import * as ActorType from './ActorType'


export class Actor {
  constructor(
    public readonly type: ActorType.ActorType,
    public pos: Point,
    public hp: number
  ) {}

  public setPos(pos: Point) {
    this.pos = pos;
  }

  public attack(other: Actor) {
    console.log('You attack the ' + other.type.name + '!');
  }

  public update(game: any) {
    return this.type.update(game);
  }

  public toString() {
    return 'Actor(char=' + this.type.char + ', pos={x:' + this.pos.x + ', y:' + this.pos.y + '}, color=' + this.type.color + ')';
  }

  public static serialize(actor: Actor) {
    let clone = <any>{};
    for (let key in actor) {
      if (!actor.hasOwnProperty(key)) continue;
      if (key === 'type') {
        clone.typeName = actor.type.typeName;
      } else {
        clone[key] = (<any>actor)[key];
      }
    }
    return clone;
  }

  public static deserialize(data: any) {
    if (!data.pos || typeof data.typeName !== 'string' || typeof data.hp !== 'number') {
      console.log('bad actor data: ' + data);
      return null;
    }

    // re-establish reference to type
    const typeName = <string>data.typeName;
    const pos = <Point>data.pos;
    const type = ActorType.getClassByName(typeName);
    if (type === undefined) {
      console.log('Unknown actor type: ' + typeName);
      return undefined;
    }
    return new Actor(type, pos, data.hp);
  }
}
