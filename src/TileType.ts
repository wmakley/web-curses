export interface TileType {
  name: string;
  char: string;
  color: string;
  bgColor?: string;
  passable: boolean;
}

export var Floor: TileType = {
  name: 'Floor',
  char: '.',
  color: '#999999',
  passable: true
}

export var Wall: TileType = {
  name: 'Wall',
  char: '#',
  color: '#CCCCCC',
  bgColor: '#333333',
  passable: false
}