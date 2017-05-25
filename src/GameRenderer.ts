import { WebCurses } from './WebCurses';
import { Map } from './Map';
import { Tile } from './Tile';
import { Actor } from './Actor';
import { GameState } from './GameState';


export class GameRenderer {
  constructor(private screen: WebCurses) {}

  public update(state: GameState) {
    this.drawBackground(state.map);
    state.actorList.forEach((actor) => {
      this.drawActor(actor);
    });
  }

  private drawBackground(map: Map) {
    this.screen.clear('#000000');
    map.eachTile((x: number, y: number, tile: Tile) => {
      var tileType = tile.type;
      this.screen.putChar(tileType.char, x, y, tileType.color, tileType.bgColor);
    });
  }

  private drawActor(actor: Actor) {
    const actorClass = actor.actorClass;
    const x = actor.pos.x;
    const y = actor.pos.y;
    this.screen.putChar(actorClass.char, x, y, actorClass.color, '#000000');
  }
}
