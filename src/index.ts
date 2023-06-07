import * as p5 from 'p5';
import { DoodleShape } from './shapes';
import { getRealMouseCoords, getUid } from './util';

const imageWidth = 540;
const imageHeight = imageWidth;

export const sketch = (p: p5) => {
  let bg: p5.Image | undefined;
  let groupId: string;

  p.preload = () => {
    bg = p.loadImage('./assets/woolywilly.svg');
  };

  p.setup = () => {
    p.createCanvas(imageWidth, imageHeight, p.WEBGL);
    p.imageMode(p.CENTER);
    if (bg) p.image(bg, 0, 0, imageWidth, imageHeight);

    const almostWhite = 230;
    p.fill(almostWhite);
  };

  const drawAtMousePos = () => {
    const [x, y] = getRealMouseCoords({ p, imageHeight, imageWidth });
    const doodleShape = new DoodleShape({ x, y, groupId, p });
    doodleShape.display();
  };

  p.draw = () => {
    p.mouseDragged = drawAtMousePos;
    p.mousePressed = () => {
      groupId = getUid();
      drawAtMousePos();
    };
  };
};

export const myp5 = new p5(sketch, document.body);
