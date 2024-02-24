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
  let toggleEl: HTMLElement | null;
  let resetButtonEl: HTMLButtonElement | null;
  let imgWidth: number;
  let imgOffset: number;

  p.preload = () => {
    bg = p.loadImage('./assets/woolywilly.svg');
  };

  function setImageSize(){
    imgWidth = p.round(p.width * IMG_SCALE);
    imgOffset = p.round(IMG_OFFSET_X * IMG_SCALE);
  }

  function drawBackground(){
    p.background(WHITE);
    p.imageMode(p.CENTER);

    if (bg) p.image(bg, imgOffset, imgOffset, imgWidth, imgWidth);
  }

  function createQuadtree(){
    const boundary = new Rectangle(-p.width/2, -p.height/2, p.width, p.height);
    qtree = new QuadTree(boundary, p);
  }

  function toggleEraseMode(eraseModeOn: boolean){
    isEraseMode = eraseModeOn;
    if (isEraseMode) {
      toggleEl.classList.add('activeRight');
      canvasEl.classList.add('eraseMode');
    } else {
      toggleEl.classList.remove('activeRight');
      canvasEl.classList.remove('eraseMode');
    }
  }

  function initControls(){
    // html widgets outside the p5 canvas
    const toggleForm = document.getElementById('draw-mode-toggle');

    toggleEl = document.getElementById('draw-mode-toggle') as HTMLElement;
    toggleForm.addEventListener('change', function(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.type === 'radio') {
        toggleEraseMode(target.value === 'erase');
      }
    });

    resetButtonEl = document.getElementsByClassName('resetButton')[0] as HTMLButtonElement;
    const downloadButton = document.getElementsByClassName('downloadButton')[0] as HTMLButtonElement;

    resetButtonEl.addEventListener('click', () => {
      resetButtonEl.classList.add('active');
      setTimeout(() => resetButtonEl.classList.remove('active'), 200);
      shapesCache = [];
      createQuadtree();
      p.redraw();
    });

    downloadButton.addEventListener('click', () => {
      p.saveCanvas('wullyWilly', 'png');
    });

    const h1 = document.querySelector('h1');
    h1.classList.add('fadeIn');
  }

  p.setup = () => {
    // init canvas
    const width = Math.min(p.windowWidth - CANVAS_MARGIN_X, CANVAS_MAX_WIDTH);
    p.createCanvas(width, width, p.WEBGL);
    canvasEl = document.querySelector('canvas');
    p.frameRate(45);
    setImageSize();
    drawBackground();

    // create quadtree data structure for efficient collision detection
    createQuadtree();

    // init html controls
    initControls();
  };

  p.windowResized = function resizeSketch() {
    const prevWidth = p.width;
    const newWidth = Math.min(p.windowWidth - CANVAS_MARGIN_X, CANVAS_MAX_WIDTH);
    p.resizeCanvas(newWidth, newWidth, true);
    setImageSize();

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

  function eraseAtMousePos(x: number, y: number){
    const didEraseShapes = qtree.findAndEraseShapes(x, y);
    if (didEraseShapes) {
      p.loop();
      shouldCleanUp = true;
    }
  }

  function drawAtMousePos(){
    const [x, y] = getRealMouseCoords(p);

    if (isEraseMode) return eraseAtMousePos(x, y);

    const doodleShape = qtree.createShape(x, y);
    if (doodleShape) shapesCache.push(doodleShape);
  }

  function cleanup(){
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
  }

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

export const myp5 = new p5(sketch, document.getElementById('canvas-container'));
