import { WebCurses } from './WebCurses';
import { Map, OUT_OF_BOUNDS } from './Map';
import { getTypeById as getTileType, OutOfBounds } from './TileType';
import { Actor } from './Actor';
import { GameState } from './GameState';
import * as Color from './Colors';
import * as Point from './Point';


export class GameRenderer {
  private readonly bgColor: string;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly fontSize: number,
    private readonly fontFace?: string,
    private readonly curses?: WebCurses
  ) {
    if (!curses) {
      this.curses = new WebCurses(canvas, fontSize, fontFace);
    }
    this.bgColor = Color.BLACK;
  }

  public getVerticalTiles() {
    return this.curses.verticalTiles;
  }

  public getHorizontalTiles() {
    return this.curses.horizontalTiles;
  }

  public update(state: GameState) {
    const centerTile = this.curses.getCenter();

    // figure out how much we need to shift the map to center the player
    const translateX = centerTile.x - state.player.pos.x;
    const translateY = centerTile.y - state.player.pos.y;
    // console.log("translateX: " + translateX + " translateY: " + translateY);

    this.curses.clear(this.bgColor);
    this.drawMap(state.map, translateX, translateY);
    state.actorList.forEach((actor) => {
      this.drawActor(actor, translateX, translateY);
    });
  }

  private drawMap(map: Map, translateX: number, translateY: number) {
    const startX = -(translateX);
    const startY = -(translateY);

    map.eachTileInSlice(
      startX, this.getHorizontalTiles(),
      startY, this.getVerticalTiles(),
      (x: number, y: number, tileId: number) => {
        if (tileId === OUT_OF_BOUNDS) {
          return;
        }
        const tileType = getTileType(tileId);
        this.curses.putChar(tileType.char, x, y, tileType.color, tileType.bgColor);
      }
    );
  }

  private drawActor(actor: Actor, translateX: number, translateY: number) {
    const actorType = actor.type;
    const x = actor.pos.x + translateX;
    const y = actor.pos.y + translateY;
    this.curses.putChar(actorType.char, x, y, actorType.color, this.bgColor);
  }
}
