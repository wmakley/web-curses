import { Map } from './Map';
import { Rect } from './Rect';
import { Actor } from './Actor';

export class Viewport {
  constructor(public readonly canvasRect:Rect, public readonly gameRect:Rect) {
  }

  public drawMap(map: Map, player: Actor) {
  }

  public static serialize(viewport: Viewport) {
    return viewport;
  }

  public static deserialize(data: any) {
    return new Viewport(data.center, data.size);
  }
}
