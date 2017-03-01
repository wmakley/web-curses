import { Point } from './Point'
import { Map } from './Map'
import { Direction } from './Command'

export class Entity {
  constructor(
    public pos: Point,
    public char: string,
    public color: string
  ) {}

  public moveInDirection(direction: Direction) {
    switch (direction) {
      case Direction.Up:
        return this.moveUp();
      case Direction.Down:
        return this.moveDown();
      case Direction.Left:
        return this.moveLeft();
      case Direction.Right:
        return this.moveRight();
    }
  }

  public moveUp() {
    return this.moveTo(this.pos.x, this.pos.y - 1);
  }

  public moveDown() {
    return this.moveTo(this.pos.x, this.pos.y + 1);
  }

  public moveLeft() {
    return this.moveTo(this.pos.x - 1, this.pos.y)
  }

  public moveRight() {
    return this.moveTo(this.pos.x + 1, this.pos.y);
  }

  public moveTo(x: number, y: number) {
    let pos = {
      x: x, y: y
    };
    return new Entity(pos, this.char, this.color);
  }
}