import { Actor } from './Actor';
import { Point } from './Point';

/**
 * Needs to know the screen dimensions to generate keys into the associative
 * array of actor positions.
 */
export class ActorList {
  private sequential: Array<Actor>;
  private associative: { [position: number]: Actor; }

  constructor(private width: number, private height: number) {
    this.sequential = [];
    this.associative = {};
  }

  public addActor(actor: Actor) {
    this.sequential.push(actor);
    let key = this.key(actor.pos);
    this.associative[key] = actor;
  }

  public removeActor(actor: Actor) {
    let key = this.key(actor.pos);
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
    if (!actor) {
      throw 'Actor not found at old position!';
    }
    delete this.associative[oldKey];
    this.associative[newKey] = actor;
  }

  public get(index: number) {
    return this.sequential[index];
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
    let actors = actorList.sequential.map((actor) => {
      return Actor.serialize(actor);
    });

    return { width: actorList.width, height: actorList.height, sequential: actors };
  }

  public static deserialize(data: any) {
    if (typeof data.sequential !== 'object' ||
      typeof data.width !== 'number' ||
      typeof data.height !== 'number') {
      console.log('bad actorList data: ' + data);
      return null;
    }

    let actorList = new ActorList(data.width, data.height);
    data.sequential.forEach((actorData: any) => {
      let actor = Actor.deserialize(actorData);
      actorList.addActor(actor);
    });

    return actorList;
  }
}
