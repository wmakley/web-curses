import { Map } from './Map';
import { Actor } from './Actor';
import { ActorList } from './ActorList';

export class Storage {

  public saveMap(name: string, map: Map) {
    return this.saveObject('Map_' + name, Map.serialize(map));
  }

  public loadMap(name: string) {
    let data = this.loadObject('Map_' + name);
    if (!data) return data;
    let map = Map.deserialize(data);
    return map;
  }

  public saveActorList(name: string, actorList: ActorList) {
    let serialized = ActorList.serialize(actorList);
    return this.saveObject('ActorList_' + name, serialized);
  }

  public loadActorList(name: string) {
    let data = this.loadObject('ActorList_' + name);
    if (!data) return data;
    return ActorList.deserialize(data);
  }

  public saveActor(name: string, actor: Actor) {
    return this.saveObject('Actor_' + name, Actor.serialize(actor));
  }

  public loadActor(name: string) {
    let data = this.loadObject('Actor_' + name);
    if (!data) return data;
    return Actor.deserialize(data);
  }

  private saveObject(name: string, object: Object) {
    let stringRep = JSON.stringify(object);
    console.log('Save data "' + name + "'");
    return window.localStorage.setItem(name, stringRep);
  }

  private loadObject(name: string) {
    let data = window.localStorage.getItem(name);
    console.log('Load data "' + name + "'");
    if (!data) return data;
    return JSON.parse(data);
  }

  public clear() {
    console.log('clear local storage');
    window.localStorage.clear();
    // in case that didn't work:
    var keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      keys.push(window.localStorage.key(i));
    }
    keys.forEach((key) => {
      console.log('remove key: ' + key);
      window.localStorage.removeItem(key);
    });
  }
}
