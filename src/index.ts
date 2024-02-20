import * as p5 from 'p5';
import { DoodleShape, QuadTree, Rectangle } from './shapes';
import { getRealMouseCoords } from './utils';

import {
  WHITE,
  IMG_SCALE,
  IMG_OFFSET_X,
  IS_DEBUG_MODE,
  CANVAS_MAX_WIDTH,
} from './constants';

export const sketch = (p: p5) => {
  let bg: p5.Image | undefined;
  let qtree: QuadTree;
  let isEraseMode = false;
  let eraseModeToggleButton: p5.Element;
  let shapesCache: DoodleShape[] = [];
  let shouldCleanUp = false;
  let canvasEl: HTMLCanvasElement | null;

  p.preload = () => {
    bg = p.loadImage('./assets/woolywilly.svg');
  };

  const drawBackground = () => {
    p.background(WHITE);
    p.imageMode(p.CENTER);
    const width = p.round(p.width * IMG_SCALE);
    const offset = p.round(IMG_OFFSET_X * IMG_SCALE);
    if (bg) p.image(bg, offset, offset, width, width);
  };

  const createQuadtree = () => {
    const boundary = new Rectangle(-p.width/2, -p.height/2, p.width, p.height);
    qtree = new QuadTree(boundary, p);
  };

  p.setup = () => {
    // init canvas
    const width = Math.min(p.windowWidth, CANVAS_MAX_WIDTH);
    p.createCanvas(width, width, p.WEBGL);
    canvasEl = document.querySelector('canvas');
    drawBackground();
    createQuadtree();

    // init erase mode toggle button
    eraseModeToggleButton = p.createButton('erase')
      .addClass('eraseModeToggleButton')
      .mousePressed(() => {
        isEraseMode = !isEraseMode;
        eraseModeToggleButton.html(isEraseMode ? 'draw' : 'erase');
        if (isEraseMode) canvasEl.classList.add('eraseMode');
        if (!isEraseMode) canvasEl.classList.remove('eraseMode');
      });
  };

  p.windowResized = () => {
    const prevWidth = p.width;
    const newWidth = Math.min(p.windowWidth, CANVAS_MAX_WIDTH);
    p.resizeCanvas(newWidth, newWidth, true);

    createQuadtree();

    const nextShapesCache: DoodleShape[] = [];

    shapesCache.forEach((shape) => {
      const x = (shape.x / prevWidth) * newWidth;
      const y = (shape.y / prevWidth) * newWidth;
      const newShape = qtree.createShape(x, y);
      if (newShape) nextShapesCache.push(newShape);
    });

    shapesCache = nextShapesCache;

    p.redraw();
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

    const shouldRebuildQuadtree = prevShapesCount !== shapesCache.length;

    if (shouldRebuildQuadtree) {
      createQuadtree();
      shapesCache.forEach((shape) => qtree.insert(shape));
    }

    shouldCleanUp = false;
    p.redraw();
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
