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

  /**
  * Iterate over each tile in a 2D slice of the map,
  * yielding each tile's coordinates RELATIVE TO THE SLICE
  * (so zero-based) and the Tile itself to a callback.
  * @param startX
  * @param sliceWidth
  * @param startY
  * @param sliceHeight
  * @param callback
  */
  public eachTileInSlice(
  startX: number, sliceWidth: number,
  startY: number, sliceHeight: number,
  callback: (x: number, y: number, tile: Tile.Tile) => void)
  {
    // console.log('map slice: X: (' + startX + '..' + (startX+sliceWidth) + ') Y: (' + startY + '..' + (startY+sliceHeight) + ')');
    for (let screenX = 0; screenX < sliceWidth; screenX += 1) {
      const mapX = startX + screenX;
      for (let screenY = 0; screenY < sliceHeight; screenY += 1) {
        const mapY = startY + screenY;
        callback(screenX, screenY, this.tileAt(mapX, mapY));
      }
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
  * Turn raw json back into a Map instance by reconnecting tiles to their type classes.
  * @param data A raw object from local storage
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
