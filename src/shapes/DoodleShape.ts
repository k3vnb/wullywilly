import * as p5 from 'p5';
import { DotAndSpeck } from './DotAndSpeck';
import { SquigglyQuad } from './SquigglyQuad';
import type { IShapeBase } from './types';

const HOVERED_THRESHOLD = 20;

export class DoodleShape {
  dotAndSpeck: DotAndSpeck;
  squigglyQuad: SquigglyQuad;
  x: number;
  y: number;
  shouldHide = false;

  constructor({ x, y, p }: IShapeBase) {
    this.x = x;
    this.y = y;
    this.dotAndSpeck = new DotAndSpeck({ x, y, p }); // adds texture to shape
    this.squigglyQuad = new SquigglyQuad({ x, y, p }); // main shape
  }

  isHovered = (mouseX: number, mouseY: number, p: p5) => {
    const d = p.dist(mouseX, mouseY, this.x, this.y);
    return d < HOVERED_THRESHOLD;
  };

  isHidden = () => this.shouldHide;

  setHide = (hide: boolean) => {
    this.shouldHide = hide;
  };

  display = () => {
    if (this.shouldHide) return;

    this.dotAndSpeck.display();
    this.squigglyQuad.display();
  };
}
