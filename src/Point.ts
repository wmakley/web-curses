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
