import Entity from './Entity';
import { Player } from './EntityType';
import { Point } from './Point';

/**
 * Data structure for all the Actors on the current map.
 * Needs to know the screen dimensions to generate keys into the associative
 * array of entity positions.
 */
export default class EntityList {
  private sequential: Array<Entity>;
  private associative: { [position: number]: Entity; }

  constructor(private readonly width: number, private readonly height: number) {
    this.sequential = [];
    this.associative = Object.create(null);
  }

  public addEntity(entity: Entity) {
    this.sequential.push(entity);
    let key = this.key(entity.pos);
    this.associative[key] = entity;
    return this.sequential.length - 1;
  }

  public removeEntity(entity: Entity) {
    const key = this.key(entity.pos);
    if (this.associative[key] === entity) {
      delete this.associative[key];
    }
    for (let i = 0; i < this.sequential.length; i++) {
      if (this.sequential[i] === entity) {
        this.sequential.splice(i, 1);
        break;
      }
    }
  }

  public entityMoved(oldPos: Point, newPos: Point) {
    const oldKey = this.key(oldPos);
    const newKey = this.key(newPos);
    const entity = this.associative[oldKey];
    if (entity === undefined) {
      throw 'Entity not found at old position!';
    }
    // This is much faster than delete, and the object will never grow
    // to be larger than the size of the current map. I could definitely
    // imagine a different data structure though.
    this.associative[oldKey] = undefined;
    this.associative[newKey] = entity;
  }

  public get(index: number) {
    return this.sequential[index];
  }

  public getPlayer() {
    let player;
    for (let i = 0; i < this.sequential.length; i += 1) {
      const elt = this.get(i);
      if (elt.type === Player) {
        player = elt;
        break;
      }
    }
    return player;
  }

  public entityAtPosition(position: Point) {
    const key = this.key(position);
    return this.associative[key];
  }

  public forEach(callback: (entity: Entity, index: number) => void, thisArg?: any) {
    this.sequential.forEach((entity, index) => {
      const result = callback.call(thisArg, entity, index);
      return result;
    });
  }

  private key(point: Point) {
    return this.width * point.y + point.x;
  }

  public static serialize(entityList: EntityList) {
    // save only the sequential Array and rebuild associative on deserialize
    const entities = entityList.sequential.map((entity) => {
      return Entity.serialize(entity);
    });

    return { width: entityList.width, height: entityList.height, sequential: entities };
  }

  public static deserialize(data: any) {
    if (typeof data.sequential !== 'object' ||
      typeof data.width !== 'number' ||
      typeof data.height !== 'number') {
      console.log('bad entityList data: ' + data);
      return undefined;
    }

    let entityList = new EntityList(data.width, data.height);
    for (let i = 0; i < data.sequential.length; i++) {
      const entity = Entity.deserialize(data.sequential[i]);
      if (entity === undefined) {
        entityList = undefined;
        break;
      }
      entityList.addEntity(entity);
    }

    return entityList;
  }
}
