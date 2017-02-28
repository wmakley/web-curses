export class WebCurses {
  private ctx: CanvasRenderingContext2D
  public readonly widthInPixels: number;
  public readonly heightInPixels: number;
  public readonly horizontalTiles: number;
  public readonly verticalTiles: number;
  private fontXCorrection: number
  private fontYCorrection: number

  constructor(private canvas: HTMLCanvasElement, public readonly fontSize: number) {
    this.ctx = canvas.getContext('2d');
    this.widthInPixels = canvas.width;
    this.heightInPixels = canvas.height;
    this.horizontalTiles = Math.floor(this.widthInPixels / fontSize);
    this.verticalTiles = Math.floor(this.heightInPixels / fontSize);

    if (typeof window.devicePixelRatio === 'number') {
      canvas.style.width = canvas.width.toString() + 'px';
      canvas.style.height = canvas.height.toString() + 'px';
      canvas.width = canvas.width * window.devicePixelRatio;
      canvas.height = canvas.height * window.devicePixelRatio;

      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    this.ctx.font = this.fontSize + 'px Menlo';
    this.fontXCorrection = 2.5;
    this.fontYCorrection = -2;

    this.clear();
  }

  public clear(color?: string) {
    this.ctx.fillStyle = color || '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public putChar(ch: string, x: number, y: number, color: string, bgColor?: string) {
    var screenX = x * this.fontSize;
    var screenY = (y + 1) * this.fontSize;
    if (typeof bgColor === 'string') {
      this.ctx.fillStyle = bgColor;
      this.ctx.fillRect(screenX, screenY - this.fontSize, this.fontSize, this.fontSize);
    }
    this.ctx.fillStyle = color;
    this.ctx.fillText(ch,
      screenX + this.fontXCorrection,
      screenY + this.fontYCorrection,
      this.fontSize
    );
  }
}