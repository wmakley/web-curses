import * as Tile from './Tile';
import { Wall, Floor } from './TileType';

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

  public tileAt(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.width) return null;
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

  public isPassable(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.width) return false;
    let tile = this.tileAt(x, y);
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
