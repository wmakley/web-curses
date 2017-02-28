import { Tile } from './Tile';
import { Wall, Floor } from './TileType';

export class Map {
  public tiles: Array<Tile>;

  constructor(public readonly width: number, public readonly height: number) {
    this.tiles = [];
    var x, y, tile;
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        if (x === 5) {
          tile = { type: Wall }
        }
        else {
          tile = { type: Floor };
        }
        this.tiles.push(tile);
      }
    }
  }

  public tileAt(x: number, y: number) {
    return this.tiles[x * y];
  }

  public eachTile(callback: (x: number, y: number, tile: Tile) => void) {
    var x, y, tile, result;
    for (x = 0; x < this.width; x++) {
      for (y = 0; y < this.height; y++) {
        tile = this.tiles[x * y];
        callback(x, y, tile);
      }
    }
  }

  public isPassable(x: number, y: number) {
    let tile = this.tileAt(x, y);
    return tile.type.passable;
  }
}