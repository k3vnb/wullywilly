import * as p5 from 'p5';
import { DoodleShape, QuadTree, Rectangle } from './shapes';
import { getRealMouseCoords } from './utils';

import {
  WHITE,
  IMG_SCALE,
  IMG_OFFSET_X,
  IS_DEBUG_MODE,
  CANVAS_MARGIN_X,
  CANVAS_MAX_WIDTH,
} from './constants';

export const sketch = (p: p5) => {
  let bg: p5.Image | undefined;
  let qtree: QuadTree;
  let isEraseMode = false;
  let shapesCache: DoodleShape[] = [];
  let shouldCleanUp = false;
  let canvasEl: HTMLCanvasElement | null;
  let eraseButton: HTMLButtonElement | null;
  let drawButton: HTMLButtonElement | null;

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

  const toggleEraseMode = (eraseModeOn: boolean) => {
    isEraseMode = eraseModeOn;
    const activeButton = isEraseMode ? eraseButton : drawButton;
    const inactiveButton = isEraseMode ? drawButton : eraseButton;
    activeButton.classList.add('active');
    inactiveButton.classList.remove('active');
    if (isEraseMode) canvasEl.classList.add('eraseMode');
    if (!isEraseMode) canvasEl.classList.remove('eraseMode');
  };

  const initControls = () => {
    eraseButton = document.getElementsByClassName('eraseButton')[0] as HTMLButtonElement;
    drawButton = document.getElementsByClassName('drawButton')[0] as HTMLButtonElement;
    const resetButton = document.getElementsByClassName('resetButton')[0] as HTMLButtonElement;
    const downloadButton = document.getElementsByClassName('downloadButton')[0] as HTMLButtonElement;

    eraseButton.addEventListener('click', () => toggleEraseMode(true));
    drawButton.addEventListener('click', () => toggleEraseMode(false));

    resetButton.addEventListener('click', () => {
      shapesCache = [];
      createQuadtree();
      p.redraw();
    });

    downloadButton.addEventListener('click', () => {
      p.saveCanvas('wullyWilly', 'png');
    });
  };

  p.setup = () => {
    // init canvas
    const width = Math.min(p.windowWidth - CANVAS_MARGIN_X, CANVAS_MAX_WIDTH);
    p.createCanvas(width, width, p.WEBGL);
    canvasEl = document.querySelector('canvas');
    drawBackground();
    createQuadtree();
    initControls();
  };

  p.windowResized = () => {
    const prevWidth = p.width;
    const newWidth = Math.min(p.windowWidth - CANVAS_MARGIN_X, CANVAS_MAX_WIDTH);
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
