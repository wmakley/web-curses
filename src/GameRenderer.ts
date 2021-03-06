import { WebCurses } from './WebCurses';
import { Map, OUT_OF_BOUNDS } from './Map';
import { TileType, getTypeById as getTileType } from './TileType';
import Entity from './Entity';
import { GameState } from './GameState';
import * as Color from './Colors';


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
    state.entityList.forEach((entity) => {
      // get the original tile for its background color
      const tile = state.map.tileTypeAt(entity.pos.x, entity.pos.y);
      this.drawEntity(entity, tile, translateX, translateY);
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

  private drawEntity(entity: Entity, tile: TileType, translateX: number, translateY: number) {
    const entityType = entity.type;
    const x = entity.pos.x + translateX;
    const y = entity.pos.y + translateY;
    this.curses.putChar(entityType.char, x, y, entityType.color, tile.bgColor);
  }
}
