export enum Direction {
  Up, Down, Left, Right, NW, NE, SW, SE
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
    case Direction.NW:
      return Direction.SE;
    case Direction.NE:
      return Direction.SW;
    case Direction.SW:
      return Direction.NE;
    case Direction.SE:
      return Direction.NW;
    default:
      throw 'Unknown direction: ' + this.direction;
  }
}
