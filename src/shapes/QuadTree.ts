import { DoodleShape } from './DoodleShape';
import { HOVER_QUERY_RANGE, IS_DEBUG_MODE } from '../constants';

const QUAD_CAPACITY = 20; // max number of shapes in a quad

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

  contains(shape: DoodleShape) {
    return (
      shape.x >= this.x - this.w &&
      shape.x < this.x + this.w &&
      shape.y >= this.y - this.h &&
      shape.y < this.y + this.h
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
    // exit if the shape is not in the boundary
    if (!this.boundary.contains(shape)) {
      return false;
    }

    // add shape if below max capacity
    if (this.shapes.length < QUAD_CAPACITY) {
      this.shapes.push(shape);
      return true;
    }

    // subdivide & recurse if max capacity is reached
    if (!this.divided) this.subdivide();

    if (this.northeast.insert(shape)) {
      return true;
    } else if (this.northwest.insert(shape)) {
      return true;
    } else if (this.southeast.insert(shape)) {
      return true;
    } else if (this.southwest.insert(shape)) {
      return true;
    }

    return false;
  }

  query(range: Rectangle, x: number, y: number, foundShapes: DoodleShape[] = []) {
    if (!this.boundary.intersects(range)) {
      return [];
    }

    for (const shape of this.shapes) {
      if (range.contains(shape)) {
        shape.hide();
      }
    }

    if (this.divided) {
      this.northwest.query(range, x, y, foundShapes);
      this.northeast.query(range, x, y, foundShapes);
      this.southwest.query(range, x, y, foundShapes);
      this.southeast.query(range, x, y, foundShapes);
    }

    return foundShapes;
  }

  createShape(x: number, y: number) {
    const newShape = new DoodleShape({ x, y, p: this.p });
    newShape.show();
    this.insert(newShape);
    return newShape;
  }

  findAndEraseShapes(x: number, y: number) {
    const range = new Rectangle(x, y, HOVER_QUERY_RANGE, HOVER_QUERY_RANGE);
    const hoveredShapes = this.query(range, x, y);
    const didHideShapes = !!hoveredShapes.length;
    return didHideShapes;
  }

  drawQuadBoundaries() {
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

  show() {
    if (IS_DEBUG_MODE) this.drawQuadBoundaries();

    for (const shape of this.shapes) {
      shape.show();
    }

    if (this.divided) {
      this.northeast.show();
      this.northwest.show();
      this.southeast.show();
      this.southwest.show();
    }
  }
}
