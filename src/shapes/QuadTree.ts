import { DoodleShape } from './DoodleShape';
import { IS_DEBUG_MODE } from '../constants';

const QUAD_CAPACITY = 10;

export class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point: DoodleShape) {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h
    );
  }

  intersects(range: Rectangle) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

export class QuadTree {
  p: p5;
  boundary: Rectangle;
  shapes: DoodleShape[];
  divided: boolean;
  northeast: QuadTree;
  northwest: QuadTree;
  southeast: QuadTree;
  southwest: QuadTree;

  constructor(boundary: Rectangle, p: p5) {
    this.boundary = boundary;
    this.shapes = [];
    this.divided = false;
    this.p = p;
  }

  subdivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.w;
    const h = this.boundary.h;

    const halfW = w / 2;
    const halfH = h / 2;

    const ne = new Rectangle(x + halfW, y - halfH, halfW, halfH);
    this.northeast = new QuadTree(ne, this.p);
    const nw = new Rectangle(x - halfW, y - halfH, halfW, halfH);
    this.northwest = new QuadTree(nw, this.p);
    const se = new Rectangle(x + halfW, y + halfH, halfW, halfH);
    this.southeast = new QuadTree(se, this.p);
    const sw = new Rectangle(x - halfW, y + halfH, halfW, halfH);
    this.southwest = new QuadTree(sw, this.p);
    this.divided = true;
  }

  insert(shape: DoodleShape) {
    if (!this.boundary.contains(shape)) {
      return false;
    }

    if (this.shapes.length < QUAD_CAPACITY) {
      this.shapes.push(shape);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      if (this.northeast.insert(shape)) {
        return true;
      } else if (this.northwest.insert(shape)) {
        return true;
      } else if (this.southeast.insert(shape)) {
        return true;
      } else if (this.southwest.insert(shape)) {
        return true;
      }
    }
  }

  query(range: Rectangle, found: DoodleShape[] = []) {
    if (!this.boundary.intersects(range)) {
      return [];
    } else {
      for (const p of this.shapes) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }
    }
    return found;
  }

  show() {
    if (IS_DEBUG_MODE) {
      this.p.stroke('#FF0000');
      this.p.noFill();
      this.p.strokeWeight(1);
      this.p.rectMode(this.p.CENTER);
      this.p.rect(
        this.boundary.x,
        this.boundary.y,
        this.boundary.w * 2,
        this.boundary.h * 2
      );
    }

    for (const shape of this.shapes) {
      shape.display();
    }

    if (this.divided) {
      this.northeast.show();
      this.northwest.show();
      this.southeast.show();
      this.southwest.show();
    }
  }
}
