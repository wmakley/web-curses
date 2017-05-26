import * as Color from './Colors';

export interface TileType {
  name: string;
  description: string;
  char: string;
  color: string;
  bgColor?: string;
  passable: boolean;
};

export const OutOfBounds: TileType = {
  name: 'OutOfBounds',
  description: 'Out of bounds',
  char: ' ',
  color: Color.BLACK,
  bgColor: Color.BLACK,
  passable: false
}

export const Floor: TileType = {
  name: 'Floor',
  description: 'Floor',
  char: '.',
  color: '#999999',
  bgColor: '#000000',
  passable: true
};

export const Wall: TileType = {
  name: 'Wall',
  description: 'Wall',
  char: '#',
  color: '#CCCCCC',
  bgColor: '#333333',
  passable: false
};

export const Water: TileType = {
  name: 'Water',
  description: 'Water',
  char: '~',
  color: '#3333FF',
  bgColor: '#000033',
  passable: true
};

export const Snow: TileType = {
  name: 'Snow',
  description: 'Snow',
  char: 'S',
  color: Color.WHITE,
  bgColor: '#666666',
  passable: true
};
