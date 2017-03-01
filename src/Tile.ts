import * as TileType from './TileType';

export interface Tile {
  type: TileType.TileType;
}

export interface SimplifiedTile {
  type: string;
}

export function serialize(tile: Tile) {
  let type = tile.type;
  let simplified = { type: type.name };
  return simplified;
}

export function deserialize(tile: SimplifiedTile) {
  let klass = (<any>TileType)[tile.type];
  if (klass) {
    return <Tile>{ type: klass };
  }
  throw "TileType not found: '" + tile.type + "'";
}