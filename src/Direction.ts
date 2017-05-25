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

export function description(direction: Direction) {
    switch (direction) {
    case Direction.Up:
      return "Up";
    case Direction.Down:
      return "Down";
    case Direction.Left:
      return "Left";
    case Direction.Right:
      return "Right";
    case Direction.NW:
      return "Northwest";
    case Direction.NE:
      return "Northeast";
    case Direction.SW:
      return "Southwest";
    case Direction.SE:
      return "Southeast";
    default:
      throw 'Unknown direction: ' + this.direction;
  }
}
