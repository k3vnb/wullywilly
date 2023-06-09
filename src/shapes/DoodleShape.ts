import * as p5 from 'p5';

import { DotAndSpeck } from './DotAndSpeck';
import { SquigglyQuad } from './SquigglyQuad';

import { getUid } from '../util';
import type { IDoodleShape } from './types';

const threshold = 20;
export class DoodleShape {
  id: string;
  groupId: string;
  dotAndSpeck: DotAndSpeck;
  squigglyQuad: SquigglyQuad;
  x: number;
  y: number;
  shouldHide = false;

  constructor({ x, y, groupId, p }: IDoodleShape) {
    this.id = getUid();
    this.groupId = groupId;
    this.x = x;
    this.y = y;
    this.dotAndSpeck = new DotAndSpeck({ x, y, p });
    this.squigglyQuad = new SquigglyQuad({ x, y, p });
  }

  isHovered = (mouseX: number, mouseY: number, p: p5) => {
    const d = p.dist(mouseX, mouseY, this.x, this.y);
    return d < threshold;
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
