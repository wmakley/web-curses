import * as TileType from './TileType';

export interface Tile {
  type: TileType.TileType;
}

export interface SimplifiedTile {
  type: string;
}

export function ofType(type: TileType.TileType) {
  return <Tile>{
    type: type
  }
}

/**
 * Convert type to a string class name.
 */
export function serialize(tile: Tile) {
  return <SimplifiedTile>{ type: tile.type.name };
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
