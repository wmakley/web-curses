import * as Point from './Point'
import * as EntityType from './EntityType';

export default class Entity {
  constructor(
    public readonly type: EntityType.EntityType,
    public pos: Point.Point,
    public hp: number
  ) { }

  public setPos(pos: Point.Point) {
    this.pos = pos;
  }

  public attack(other: Entity) {
    console.log('You attack the ' + other.type.name + '!');
  }

  public update(game: any) {
    return this.type.update(game);
  }

  public toString() {
    return 'Entity(char=' + this.type.char + ', pos={x:' + this.pos.x + ', y:' + this.pos.y + '}, color=' + this.type.color + ')';
  }

  public static serialize(actor: Entity) {
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
    const type = EntityType.getClassById(typeId);
    if (type === undefined) {
      console.log('Unknown actor type: ' + typeId);
      return undefined;
    }
    return new Entity(type, pos, data.hp);
  }
}
