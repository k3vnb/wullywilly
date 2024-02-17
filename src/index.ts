import * as p5 from 'p5';
import { DoodleShape } from './shapes';
import { getRealMouseCoords } from './utils';
import {
  WHITE,
  START_X,
  START_Y,
  GRID_SIZE,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
} from './constants';

export const sketch = (p: p5) => {
  let bg: p5.Image | undefined;
  let isEraseMode = false;
  let eraseModeToggleButton: p5.Element;

  const shapes: DoodleShape[] = [];
  const newShapes: DoodleShape[] = [];

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

    eraseModeToggleButton = p.createButton('erase')
      .addClass('eraseModeToggleButton')
      .mousePressed(() => {
        isEraseMode = !isEraseMode;
        eraseModeToggleButton.html(isEraseMode ? 'draw' : 'erase');
      });
  };

  const drawAtMousePos = () => {
    const [x, y] = getRealMouseCoords(p);
    const doodleShape = new DoodleShape({ x, y, p });
  };

  const removeHiddenShapes = () => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (shapes[i].isHidden()) shapes.splice(i, 1);
    }
  };

  p.mouseDragged = drawAtMousePos;
  p.mousePressed = () => {
    drawAtMousePos();
  };
  p.mouseReleased = () => {
    if (isEraseMode) removeHiddenShapes();
    if (newShapes.length) shapes.push(...newShapes);
    newShapes.length = 0;
  };

  p.draw = () => {
    drawBackground();
    for (let i = 0; i < shapes.length; i++) {
      if (!shapes[i].isHidden()) shapes[i].display();
    }
    p.noLoop();
  };
};

export const myp5 = new p5(sketch, document.body);
