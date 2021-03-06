import { GameState } from './GameState';

/**
 * TODO: need to just have a function to save and load an entire game,
 * and allow multiple saves with different names.
 */
export class Storage {

  public saveGame(name: string, gameState: GameState) {
    return this.saveObject('Game_' + name, GameState.serialize(gameState));
  }

  public loadGame(name: string) {
    const data = this.loadObject('Game_' + name);
    if (!data) return undefined;
    const gameState = GameState.deserialize(data);
    return gameState;
  }

  private saveObject(name: string, object: Object) {
    let stringRep = JSON.stringify(object);
    // console.log('Save data "' + name + "'");
    return window.localStorage.setItem(name, stringRep);
  }

  // Always return undefined on failure
  private loadObject(name: string) {
    const data = window.localStorage.getItem(name);
    // console.log('Load data "' + name + "'");
    if (data === null || data === undefined) return undefined;
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

    return true;
  }

  public dataExists(name: string) {
    const data = this.loadGame(name);
    return (typeof data !== 'undefined' && data !== null);
  }
}
