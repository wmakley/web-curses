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
