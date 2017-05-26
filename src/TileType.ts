import * as Color from './Colors';

export interface TileType {
  id: number;
  description: string;
  char: string;
  color: string;
  bgColor?: string;
  passable: boolean;
};

export const OutOfBounds: TileType = {
  id: 0,
  description: 'Out of bounds',
  char: ' ',
  color: Color.BLACK,
  bgColor: Color.BLACK,
  passable: false
}

export const Floor: TileType = {
  id: 1,
  description: 'Floor',
  char: '.',
  color: '#999999',
  bgColor: '#000000',
  passable: true
};

export const Wall: TileType = {
  id: 2,
  description: 'Wall',
  char: '#',
  color: '#CCCCCC',
  bgColor: '#333333',
  passable: false
};

export const Water: TileType = {
  id: 3,
  description: 'Water',
  char: '~',
  color: '#3333FF',
  bgColor: '#000033',
  passable: true
};

export const Snow: TileType = {
  id: 4,
  description: 'Snow',
  char: 'S',
  color: Color.WHITE,
  bgColor: '#666666',
  passable: true
};

const types: Array<TileType> = [
  OutOfBounds,
  Floor,
  Wall,
  Water,
  Snow
]

export function getTypeById(id: number) {
  return types[id];
}
