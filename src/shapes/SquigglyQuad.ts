import * as p5 from 'p5';
import { getRandomInt, getShadeOfGray, generateClockwiseVertices } from '../utils';
import type { IShapeBase } from './types';

const ALMOST_WHITE = 230;

export class SquigglyQuad {
  x: number;
  y: number;
  p: p5;
  color: number;
  strokeWeight: number;
  vertices: number[][];

  constructor({ x, y, p }: IShapeBase) {
    this.vertices = generateClockwiseVertices({ x, y, p });
    this.p = p;
    this.color = getShadeOfGray({ p });
    this.strokeWeight = getRandomInt({ min: 1, max: 2, p });
  }

  display = () => {
    this.p.stroke(this.color);
    this.p.strokeWeight(this.strokeWeight);
    this.p.point(this.x, this.y);
    this.p.fill(ALMOST_WHITE);
    const [x1, y1, x2, y2, x3, y3, x4, y4] = this.vertices.flat();
    this.p.quad(x1, y1, x2, y2, x3, y3, x4, y4);
  };
}
