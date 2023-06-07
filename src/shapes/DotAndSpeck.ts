import * as p5 from 'p5';
import { getRandomInt, getShadeOfGray, generateClockwiseVertices } from '../util';
import type { IShapeBase } from './types';

export class DotAndSpeck {
  x: number;
  y: number;
  p: p5;
  dotRadius = 3;
  speckRadius = 2;
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

  display = () => {
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