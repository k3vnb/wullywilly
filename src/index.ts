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
  let shapesCache: DoodleShape[] = [];
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
    // init canvas
    p.createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT, p.WEBGL);
    drawBackground();

    // init quadtree
    const initBoundary = new Rectangle(-IMAGE_WIDTH/2, -IMAGE_HEIGHT/2, IMAGE_WIDTH, IMAGE_HEIGHT);
    qtree = new QuadTree(initBoundary, p);

    // init erase mode toggle button
    eraseModeToggleButton = p.createButton('erase')
      .addClass('eraseModeToggleButton')
      .mousePressed(() => {
        isEraseMode = !isEraseMode;
        eraseModeToggleButton.html(isEraseMode ? 'draw' : 'erase');
      });
  };

  const eraseAtMousePos = (x: number, y: number) => {
    p.loop();
    const didEraseShapes = qtree.findAndEraseShapes(x, y);
    if (didEraseShapes) shouldCleanUp = true;
  };

  const drawAtMousePos = () => {
    const [x, y] = getRealMouseCoords(p);

    if (isEraseMode) return eraseAtMousePos(x, y);

    const doodleShape = qtree.createShape(x, y);
    if (doodleShape) shapesCache.push(doodleShape);
  };

  const cleanup = () => {
    // remove hidden shapes from cache & quadtree for better performance
    const prevShapesCount = shapesCache.length;
    shapesCache = shapesCache.filter((shape) => !shape.isHidden);

    const shouldReconstructQuadtree = prevShapesCount !== shapesCache.length;

    if (shouldReconstructQuadtree) {
      const newQtree = new QuadTree(qtree.boundary, p);
      shapesCache.forEach(newQtree.insert);
      qtree = newQtree;
    }

    shouldCleanUp = false;
  };

  p.mouseDragged = drawAtMousePos;

  p.mousePressed = drawAtMousePos;

  p.mouseReleased = () => {
    if (IS_DEBUG_MODE) qtree.show();
    if (shouldCleanUp) cleanup();
  };

  p.draw = () => {
    drawBackground(); // re-render the background to hide stale shapes from prev render
    qtree.show(); // draw the quadtree, which contains all the shapes
    p.noLoop();
  };
};

export const myp5 = new p5(sketch, document.body);
