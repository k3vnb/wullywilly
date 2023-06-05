import * as p5 from 'p5';

const imageWidth = 540;
const imageHeight = imageWidth;

export const sketch = (p: p5) => {
  let bg: p5.Image | undefined;

  const getRandomInt = (min: number, max: number): number => (
    p.int(p.random(min, max))
  );

  const generateClockwiseVertices = (x: number, y: number): Array<number[]> => {
    const getXVal = (): number => getRandomInt(0, 4);
    const getYVal = (): number => getRandomInt(0, 10);

    const v1 = [x - getXVal(), y - getYVal()];
    const v2 = [x + getXVal(), y - getYVal()];
    const v3 = [x + getXVal(), y + getYVal()];
    const v4 = [x - getXVal(), y + getYVal()];
    return [v1, v2, v3, v4];
  };

  const drawDots = (x: number, y: number) => {
    const dotColor = getRandomInt(0, 25);
    const dotRadius = 3;

    const speckColor = getRandomInt(0, 25);
    const speckRadius = 2;

    const orbitingCoords = generateClockwiseVertices(x, y);

    // draw a speck
    p.stroke(speckColor);
    p.strokeWeight(speckRadius);
    const [speckX, speckY] = orbitingCoords[getRandomInt(0, orbitingCoords.length)];
    p.point(speckX, speckY);

    // draw a dot
    p.stroke(dotColor);
    p.strokeWeight(dotRadius);
    p.point(x, y);
  };

  const drawDoodle = (x: number, y: number) => {
    const doodleColor = getRandomInt(0, 25);
    const doodleStrokeWeight = getRandomInt(1, 3);
    const [x1, y1, x2, y2, x3, y3, x4, y4] = generateClockwiseVertices(x, y).flat();

    // draw a doodle (its really just a squiggly quad)
    p.stroke(doodleColor);
    p.strokeWeight(doodleStrokeWeight);
    p.quad(x1, y1, x2, y2, x3, y3, x4, y4);
  };

  const draw = (x: number, y: number) => {
    drawDots(x, y);
    drawDoodle(x, y);
  };

  p.preload = () => {
    bg = p.loadImage('./assets/woolywilly.svg');
  };

  p.setup = () => {
    p.createCanvas(imageWidth, imageHeight, p.WEBGL);
    p.imageMode(p.CENTER);
    if (bg) p.image(bg, 0, 0, imageWidth, imageHeight);
    p.fill(230);
  };

  const getRealMouseCoords = (e: MouseEvent): [number, number] => (
    [e.clientX - (imageWidth / 2), e.clientY - (imageHeight / 2)]
  );

  const drawAtMousePos = (e: MouseEvent) => {
    const [x, y] = getRealMouseCoords(e);
    draw(x,y);
  };

  p.draw = () => {
    p.mouseDragged = drawAtMousePos;
    p.mousePressed = drawAtMousePos;
  };
};

export const myp5 = new p5(sketch, document.body);
