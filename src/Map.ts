import * as Tile from './Tile';
import { Wall, Floor, OutOfBounds } from './TileType';

export const OUT_OF_BOUNDS = <Tile.Tile>{ type: OutOfBounds };

/**
 * Basically just a container of a bunch of tiles.
 */
export class Map {
  protected tiles: Array<Tile.Tile>;

  constructor(public readonly width: number, public readonly height: number) {
    this.tiles = [];
    var x, y, tile;
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        if (y === 4) {
          tile = { type: Wall }
        }
        else {
          tile = { type: Floor };
        }
        this.tiles.push(tile);
      }
    }
  }

  /**
   * Returns OUT_OF_BOUNDS if the coordinates are invalid.
   * @param x
   * @param y
   */
  public tileAt(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return OUT_OF_BOUNDS;
    }
    return this.tiles[this.width * y + x];
  }

  public eachTile(callback: (x: number, y: number, tile: Tile.Tile) => void) {
    var x, y, tile, result;
    for (x = 0; x < this.width; x++) {
      for (y = 0; y < this.height; y++) {
        callback(x, y, this.tileAt(x, y));
      }
    }
  }

  public eachTileInSlice(
    startX: number, sliceWidth: number,
    startY: number, sliceHeight: number,
    callback: (x: number, y: number, tile: Tile.Tile) => void)
  {
    let screenX = 0;
    for (let x = startX; x < sliceWidth; x += 1) {
      let screenY = 0;
      for (let y = startY; y < sliceHeight; y += 1) {
        callback(screenX, screenY, this.tileAt(x, y));
        screenY += 1;
      }
      screenX += 1;
    }
  }

  public isPassable(x: number, y: number) {
    const tile = this.tileAt(x, y);
    return tile.type.passable;
  }

  public static serialize(map: Map) {
    return {
      width: map.width,
      height: map.height,
      tiles: map.tiles.map((tile) => {
        return Tile.serialize(tile);
      })
    };
  }

  /**
   * Reconnect tiles to their type classes and turn raw json back into a Map instance.
   * @param data
   */
  public static deserialize(data: any) {
    let tiles = data.tiles;
    let width = data.width;
    let height = data.height;
    if (!tiles || typeof tiles !== 'object' || typeof width !== 'number' || typeof height !== 'number' || typeof tiles.length !== 'number') {
      console.log('bad map data: ' + data);
      return null;
    }
    let deserializedTiles = <Array<Tile.Tile>>[];
    for (let i = 0; i < tiles.length; i++) {
      deserializedTiles.push(Tile.deserialize(tiles[i]));
    }
    let map = new Map(data.width, data.height);
    map.tiles = deserializedTiles;
    return map;
  }
}
