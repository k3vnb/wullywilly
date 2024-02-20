import * as p5 from 'p5';
import { getRandomInt, getShadeOfGray, generateClockwiseVertices } from '../utils';
import type { IShapeBase } from './types';

const DOT_RADIUS = 3;
const SPECK_RADIUS = 2;

export class DotAndSpeck {
  x: number;
  y: number;
  p: p5;
  dotRadius = DOT_RADIUS;
  speckRadius = SPECK_RADIUS;
  dotColor: number;
  speckColor: number;
  speckCoord: number[];

  constructor({ x, y, p }: IShapeBase) {
    this.x = x;
    this.y = y;
    this.p = p;
    this.dotColor = getShadeOfGray({ p });
    this.speckColor = getShadeOfGray({ p });

    const orbitingCoords = generateClockwiseVertices({ x, y, p });
    const randomCoord = orbitingCoords[getRandomInt({ min: 0, max: orbitingCoords.length, p })];
    this.speckCoord = randomCoord;
  }

  show = () => {
    // draw a speck
    this.p.stroke(this.speckColor);
    this.p.strokeWeight(this.speckRadius);
    const [speckX, speckY] = this.speckCoord;
    this.p.point(speckX, speckY);

    // draw a dot
    this.p.stroke(this.dotColor);
    this.p.strokeWeight(this.dotRadius);
    this.p.point(this.x, this.y);
  };
}
