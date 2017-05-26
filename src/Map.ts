import * as Tile from './Tile';
import * as TileType from './TileType';
import * as PerlinNoise from './PerlinNoise';

export const OUT_OF_BOUNDS = <Tile.Tile>{ type: TileType.OutOfBounds };

/**
* Basically just a container of a bunch of tiles.
*/
export class Map {
  protected tiles: Array<Tile.Tile>;

  constructor(public readonly width: number, public readonly height: number) {
    this.tiles = [];
    this.genPerlin();
  }

  /**
   *
   * @param callback A function that takes x and y coordinates, and returns a Tile
   */
  private generate(callback: (x: number, y: number) => Tile.Tile) {
    console.log('generate map: width: ' + this.width + ' height: ' + this.height);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = callback(x, y);
        this.tiles.push(tile);
      }
    }
  }

  private genDefault() {
    this.generate((x: number, y: number) => {
      if (y === 4) {
        return { type: TileType.Wall }
      }
      else {
        return { type: TileType.Floor };
      }
    });
  }

  private genPerlin() {
    this.generate((j: number, i: number) => {
      const x = j / this.width;
      const y = i / this.height;

      const n = PerlinNoise.noise(10.0 * x, 10.0 * y, 0.8);

      // water
      if (n < 0.35) {
        return Tile.ofType(TileType.Water);
      }
      // floors or plains
      else if (n >= 0.35 && n < 0.6) {
        return Tile.ofType(TileType.Floor);
      }
      // walls / mountains
      else if (n >= 0.6 && n < 0.8) {
        return Tile.ofType(TileType.Wall);
      }
      // ice / snow
      else {
        return Tile.ofType(TileType.Snow);
      }
    });
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
