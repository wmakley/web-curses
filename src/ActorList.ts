import { Actor } from './Actor';
import { Player } from './ActorType';
import { Point } from './Point';

/**
 * Data structure for all the Actors on the current map.
 * Needs to know the screen dimensions to generate keys into the associative
 * array of actor positions.
 */
export class ActorList {
  private sequential: Array<Actor>;
  private associative: { [position: number]: Actor; }

  constructor(private readonly width: number, private readonly height: number) {
    this.sequential = [];
    this.associative = Object.create(null);
  }

  public addActor(actor: Actor) {
    this.sequential.push(actor);
    let key = this.key(actor.pos);
    this.associative[key] = actor;
    return this.sequential.length - 1;
  }

  public removeActor(actor: Actor) {
    const key = this.key(actor.pos);
    if (this.associative[key] === actor) {
      delete this.associative[key];
    }
    for (let i = 0; i < this.sequential.length; i++) {
      if (this.sequential[i] === actor) {
        this.sequential.splice(i, 1);
        break;
      }
    }
  }

  public actorMoved(oldPos: Point, newPos: Point) {
    const oldKey = this.key(oldPos);
    const newKey = this.key(newPos);
    const actor = this.associative[oldKey];
    if (actor === undefined) {
      throw 'Actor not found at old position!';
    }
    // This is much faster than delete, and the object will never grow
    // to be larger than the size of the current map. I could definitely
    // imagine a different data structure though.
    this.associative[oldKey] = undefined;
    this.associative[newKey] = actor;
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

  public actorAtPosition(position: Point) {
    const key = this.key(position);
    return this.associative[key];
  }

  public forEach(callback: (actor: Actor, index: number) => void, thisArg?: any) {
    this.sequential.forEach((actor, index) => {
      const result = callback.call(thisArg, actor, index);
      return result;
    });
  }

  private key(point: Point) {
    return this.width * point.y + point.x;
  }

  public static serialize(actorList: ActorList) {
    // save only the sequential Array and rebuild associative on deserialize
    const actors = actorList.sequential.map((actor) => {
      return Actor.serialize(actor);
    });

    return { width: actorList.width, height: actorList.height, sequential: actors };
  }

  public static deserialize(data: any) {
    if (typeof data.sequential !== 'object' ||
      typeof data.width !== 'number' ||
      typeof data.height !== 'number') {
      console.log('bad actorList data: ' + data);
      return undefined;
    }

    let actorList = new ActorList(data.width, data.height);
    for (let i = 0; i < data.sequential.length; i++) {
      const actor = Actor.deserialize(data.sequential[i]);
      if (actor === undefined) {
        actorList = undefined;
        break;
      }
      actorList.addActor(actor);
    }

    return actorList;
  }
}
