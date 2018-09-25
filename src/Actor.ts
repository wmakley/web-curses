import * as Point from './Point'
import * as ActorType from './ActorType';

export class Actor {
  constructor(
    public readonly type: ActorType.ActorType,
    public pos: Point.Point,
    public hp: number
  ) {}

  public setPos(pos: Point.Point) {
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
    const clone = <any>{};
    for (const key in actor) {
      if (!actor.hasOwnProperty(key)) continue;
      if (key === 'type') {
        clone.typeId = actor.type.id;
      } else if (key === 'pos') {
        clone[key] = Point.serialize(actor[key])
      } else {
        clone[key] = (<any>actor)[key];
      }
    }
    return clone;
  }

  public static deserialize(data: any) {
    if (!data.pos || typeof data.typeId !== 'string' || typeof data.hp !== 'number') {
      console.log('bad actor data: ' + data);
      return undefined;
    }

    // re-establish reference to type
    const typeId = <string>data.typeId;
    const pos = Point.deserialize(<Array<number>>data.pos);
    const type = ActorType.getClassById(typeId);
    if (type === undefined) {
      console.log('Unknown actor type: ' + typeId);
      return undefined;
    }
    return new Actor(type, pos, data.hp);
  }
}
