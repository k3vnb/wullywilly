import * as p5 from 'p5';
import { DoodleShape } from './shapes';
import { getRealMouseCoords, getUid } from './util';

const imageWidth = 540;
const imageHeight = imageWidth;

export const sketch = (p: p5) => {
  let bg: p5.Image | undefined;
  let groupId: string;
  let isEraseMode = false;
  let eraseModeToggleButton: p5.Element;

  const shapes: DoodleShape[] = [];
  const newShapes: DoodleShape[] = [];

  p.preload = () => {
    bg = p.loadImage('./assets/woolywilly.svg');
  };

  const drawBackground = () => {
    p.background(255);
    p.imageMode(p.CENTER);
    if (bg) p.image(bg, 0, 0, imageWidth, imageHeight);
  };

  p.setup = () => {
    p.createCanvas(imageWidth, imageHeight, p.WEBGL);
    drawBackground();

    const almostWhite = 230;
    p.fill(almostWhite);

    eraseModeToggleButton = p.createButton('erase').mousePressed(() => {
      isEraseMode = !isEraseMode;
      eraseModeToggleButton.html(isEraseMode ? 'draw' : 'erase');
    });
  };

  const drawAtMousePos = () => {
    const [x, y] = getRealMouseCoords({ p, imageHeight, imageWidth });
    if (!isEraseMode) {
      const doodleShape = new DoodleShape({ x, y, groupId, p });
      newShapes.push(doodleShape);
      newShapes.forEach((shape) => shape.display());
    } else {
      p.loop();
      shapes.forEach((shape) => {
        if (shape.isHovered(x, y, p)) shape.setHide(true);
      });
    }
  };

  const removeHiddenShapes = () => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (shapes[i].isHidden()) shapes.splice(i, 1);
    }
  };

  p.mouseDragged = drawAtMousePos;
  p.mousePressed = () => {
    groupId = getUid();
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
