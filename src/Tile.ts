import * as TileType from './TileType';

export function ofType(type: TileType.TileType) {
  return type.id;
}

export function type(id: number) {
  return TileType.getTypeById(id);
}

/**
 * Convert type to a string class name.
 */
export function serialize(tile: number) {
  return tile;
}

/**
 * Restore the reference to a TileType using its name.
 */
export function deserialize(tileId: number) {
  return tileId;
}
