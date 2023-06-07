import { DotAndSpeck } from './DotAndSpeck';
import { SquigglyQuad } from './SquigglyQuad';

import { getUid } from '../util';
import type { IDoodleShape } from './types';

export class DoodleShape {
  id: string;
  groupId: string;
  dotAndSpeck: DotAndSpeck;
  squigglyQuad: SquigglyQuad;

  constructor({ x, y, groupId, p }: IDoodleShape) {
    this.id = getUid();
    this.groupId = groupId;
    this.dotAndSpeck = new DotAndSpeck({ x, y, p });
    this.squigglyQuad = new SquigglyQuad({ x, y, p });
  }

  display = () => {
    this.dotAndSpeck.display();
    this.squigglyQuad.display();
  };
}
