import * as p5 from 'p5';
import { DoodleShape, QuadTree, Rectangle } from './shapes';
import { getRealMouseCoords } from './utils';

import {
  WHITE,
  START_X,
  START_Y,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  IS_DEBUG_MODE,
} from './constants';

export const sketch = (p: p5) => {
  let bg: p5.Image | undefined;
  let qtree: QuadTree;
  let isEraseMode = false;
  let eraseModeToggleButton: p5.Element;
  let shapes: DoodleShape[] = [];
  let shouldCleanUp = false;

  p.preload = () => {
    bg = p.loadImage('./assets/woolywilly.svg');
  };

  const drawBackground = () => {
    p.background(WHITE);
    p.imageMode(p.CENTER);
    if (bg) p.image(bg, START_X, START_Y, IMAGE_WIDTH, IMAGE_HEIGHT);
  };

  p.setup = () => {
    p.createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT, p.WEBGL);
    drawBackground();
    const boundary = new Rectangle(-IMAGE_WIDTH/2, -IMAGE_HEIGHT/2, IMAGE_WIDTH, IMAGE_HEIGHT);

    qtree = new QuadTree(boundary, 10, p);

    eraseModeToggleButton = p.createButton('erase')
      .addClass('eraseModeToggleButton')
      .mousePressed(() => {
        isEraseMode = !isEraseMode;
        eraseModeToggleButton.html(isEraseMode ? 'draw' : 'erase');
      });
  };

  const getShapesInQuadTree = (x: number, y: number) => {
    const range = new Rectangle(x, y, 20, 20);
    return qtree.query(range);
  };

  const eraseAtMousePos = (x: number, y: number) => {
    const shapesInRange = getShapesInQuadTree(x, y);
    if (!shapesInRange.length) return;
    p.loop();
    shapesInRange.forEach((shape) => {
      if (shape.isHovered(x, y, p)) {
        shape.setHide(true);
        shouldCleanUp = true;
      }
    });
  };

  const drawAtMousePos = () => {
    const [x, y] = getRealMouseCoords(p);

    if (isEraseMode) return eraseAtMousePos(x, y);

    const doodleShape = new DoodleShape({ x, y, p });
    doodleShape.display();
    qtree.insert(doodleShape);
    shapes.push(doodleShape);
  };

  const cleanup = () => {
    const shapesCount = shapes.length;
    shapes = shapes.filter((shape) => !shape.isHidden());
    const shouldCleanShapes = shapesCount !== shapes.length;
    if (shouldCleanShapes) {
      const newQtree = new QuadTree(qtree.boundary, 10, p);
      shapes = shapes.filter((shape) => !shape.isHidden());
      shapes.forEach((shape) => {
        newQtree.insert(shape);
      });
      qtree = newQtree;
    }
    shouldCleanUp = false;
  };

  p.mouseDragged = drawAtMousePos;

  p.mousePressed = () => {
    drawAtMousePos();
  };

  p.mouseReleased = () => {
    if (IS_DEBUG_MODE) qtree.show();
    if (shouldCleanUp) cleanup();
  };

  p.draw = () => {
    drawBackground();
    qtree.show();
    p.noLoop();
  };
};

export const myp5 = new p5(sketch, document.body);
