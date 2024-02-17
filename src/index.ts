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

  const newShapes: DoodleShape[] = [];
  let shapes: DoodleShape[] = [];
  const grid: Array<Array<DoodleShape[]>> = [];

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

  const addToGrid = (shape: DoodleShape) => {
    const { gridCellX, gridCellY } = shape;
    if (!grid[gridCellX]) grid[gridCellX] = [];
    if (!grid[gridCellX][gridCellY]) grid[gridCellX][gridCellY] = [];
    grid[gridCellX][gridCellY].push(shape);
  };

  const getShapesInGridCell = (x: number, y: number): DoodleShape[] => {
    const gridCellX = Math.floor(x / GRID_SIZE);
    const gridCellY = Math.floor(y / GRID_SIZE);
    return grid[gridCellX]?.[gridCellY] || [];
  };

  const eraseAtMousePos = (x: number, y: number) => {
    p.loop();
    const shapesInCell = getShapesInGridCell(x, y);
    shapesInCell.forEach((shape) => {
      if (shape.isHovered(x, y, p)) shape.setHide(true);
    });
  };

  const drawAtMousePos = () => {
    const [x, y] = getRealMouseCoords(p);

    if (isEraseMode) return eraseAtMousePos(x, y);

    const doodleShape = new DoodleShape({ x, y, p });
    doodleShape.display();
    newShapes.push(doodleShape);
    addToGrid(doodleShape);
    newShapes.forEach((shape) => shape.display());
  };

  const removeHiddenShapes = () => {
    shapes = shapes.filter((shape) => !shape.isHidden());
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
