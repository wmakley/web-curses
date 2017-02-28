import { Point } from './Point'
import { Map } from './Map'

export class Entity {
  constructor(public pos: Point, public char: string, public color: string) {
  }

  public moveUp(map: Map) {
    return this.moveTo(this.pos.x, this.pos.y - 1, map);
  }

  public moveDown(map: Map) {
    return this.moveTo(this.pos.x, this.pos.y + 1, map);
  }

  public moveLeft(map: Map) {
    return this.moveTo(this.pos.x - 1, this.pos.y, map)
  }

  public moveRight(map: Map) {
    return this.moveTo(this.pos.x + 1, this.pos.y, map);
  }

  public moveTo(x: number, y: number, map: Map) {
    if (map.isPassable(x, y)) {
      this.pos.x = x;
      this.pos.y = y;
      return true;
    }
    return false;
  }
}