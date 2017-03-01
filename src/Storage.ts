import { Map } from './Map';
import { Entity } from './Entity';

export class Storage {

  public saveMap(name: string, map: Map) {
    return this.saveObject('map_' + name, Map.serialize(map));
  }

  public loadMap(name: string) {
    let data = this.loadObject('map_' + name);
    if (!data) return data;
    let map = Map.deserialize(data);
    return map;
  }

  public saveEntity(name: string, entity: Entity) {
    return this.saveObject('entity_' + name, entity);
  }

  public loadEntity(name: string) {
    let data = this.loadObject('entity_' + name);
    if (!data) return data;
    return new Entity(data.pos, data.char, data.color);
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