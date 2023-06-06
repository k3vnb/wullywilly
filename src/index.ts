import * as p5 from 'p5';
import { getRandomInt, generateClockwiseVertices, getRealMouseCoords } from './util';

const imageWidth = 540;
const imageHeight = imageWidth;

export const sketch = (p: p5) => {
  let bg: p5.Image | undefined;

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

  const getShadeOfGray = (): number => getRandomInt({ min: 0, max: 25, p });

  const drawDots = (x: number, y: number) => {
    const dotColor = getShadeOfGray();
    const dotRadius = 3;

    const speckColor = getShadeOfGray();
    const speckRadius = 2;

    const orbitingCoords = generateClockwiseVertices({ x, y, p });
    const randomCoord = orbitingCoords[getRandomInt({ min: 0, max: orbitingCoords.length, p })];

    // draw a speck
    p.stroke(speckColor);
    p.strokeWeight(speckRadius);
    const [speckX, speckY] = randomCoord;
    p.point(speckX, speckY);

    // draw a dot
    p.stroke(dotColor);
    p.strokeWeight(dotRadius);
    p.point(x, y);
  };

  const drawDoodleShape = (x: number, y: number) => {
    const doodleColor = getShadeOfGray();
    const doodleStrokeWeight = getRandomInt({ min:  1, max: 3, p });
    const [x1, y1, x2, y2, x3, y3, x4, y4] = generateClockwiseVertices({ x, y, p }).flat();

    // draw a doodle shape (its just a squiggly quad)
    p.stroke(doodleColor);
    p.strokeWeight(doodleStrokeWeight);
    p.quad(x1, y1, x2, y2, x3, y3, x4, y4);
  };

  const drawAtMousePos = () => {
    const [x, y] = getRealMouseCoords({ p, imageHeight, imageWidth });
    drawDots(x, y);
    drawDoodleShape(x, y);
  };

  p.draw = () => {
    p.mouseDragged = drawAtMousePos;
    p.mousePressed = drawAtMousePos;
  };
};

export const myp5 = new p5(sketch, document.body);
