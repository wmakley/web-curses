export enum Direction {
  Up, Down, Left, Right
}

export function reverse(direction: Direction) {
  switch (this.direction) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
    case Direction.Right:
      return Direction.Left;
    default:
      throw 'Unknown direction: ' + this.direction;
  }
}
