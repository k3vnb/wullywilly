import { DotAndSpeck } from './DotAndSpeck';
import { SquigglyQuad } from './SquigglyQuad';
import type { IShapeBase } from './types';

export class DoodleShape {
  dotAndSpeck: DotAndSpeck;
  squigglyQuad: SquigglyQuad;
  x: number;
  y: number;
  isHidden = false;

  constructor({ x, y, p }: IShapeBase) {
    this.x = x;
    this.y = y;
    this.dotAndSpeck = new DotAndSpeck({ x, y, p }); // adds texture to shape
    this.squigglyQuad = new SquigglyQuad({ x, y, p }); // main shape
  }

  hide = () => this.isHidden = true;

  show = () => {
    if (this.isHidden) return;

    this.dotAndSpeck.show();
    this.squigglyQuad.show();
  };
}
