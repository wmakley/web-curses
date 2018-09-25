import { Direction } from './Direction';


export interface Point {
  x: number
  y: number
}


export function clone(point: Point) {
  return <Point>{
    x: point.x,
    y: point.y
  };
}

/**
 * Convert a point to a more compressed tuple Array.
 */
export function serialize(point: Point) : Array<number> {
  return [point.x, point.y];
}

/**
 * Convert tuple Array to a Point object.
 */
export function deserialize(tuple: Array<number>): Point {
  if (tuple.length !== 2) {
    throw 'Input should be an array of length 2';
  }
  if (typeof tuple[0] !== 'number' || typeof tuple[1] !== 'number') {
    throw 'One of the array elements was not a number';
  }
  return <Point>{ x: tuple[0], y: tuple[1] };
}

export function moveInDirection(point: Point, direction: Direction) {
  switch (direction) {
    case Direction.Up:
      return moveUp(point);
    case Direction.Down:
      return moveDown(point);
    case Direction.Left:
      return moveLeft(point);
    case Direction.Right:
      return moveRight(point);
    case Direction.NW:
      return moveNW(point);
    case Direction.NE:
      return moveNE(point);
    case Direction.SW:
      return moveSW(point);
    case Direction.SE:
      return moveSE(point);
  }
}

export function moveUp(point: Point) {
  return { x: point.x, y: point.y - 1 };
}

export function moveDown(point: Point) {
  return { x: point.x, y: point.y + 1 };
}

export function moveLeft(point: Point) {
  return { x: point.x - 1, y: point.y };
}

export function moveRight(point: Point) {
  return { x: point.x + 1, y: point.y };
}

export function moveNW(point: Point) {
  return moveLeft(moveUp(point));
}

export function moveNE(point: Point) {
  return moveRight(moveUp(point));
}

export function moveSW(point: Point) {
  return moveLeft(moveDown(point));
}

export function moveSE(point: Point) {
  return moveRight(moveDown(point));
}
