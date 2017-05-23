import * as TileType from './TileType';

export interface Tile {
  type: TileType.TileType;
}

export interface SimplifiedTile {
  type: string;
}

/**
 * Convert type to a string class name.
 */
export function serialize(tile: Tile) {
  const type = tile.type;
  const simplified = { type: type.name };
  return simplified;
}

/**
 * Restore the reference to a TileType using its name.
 */
export function deserialize(tile: SimplifiedTile) {
  const klass = (<any>TileType)[tile.type];
  if (klass !== undefined) {
    return <Tile>{ type: klass };
  }
  throw "TileType not found: '" + tile.type + "'";
}
