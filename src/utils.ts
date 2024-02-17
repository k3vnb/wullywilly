import * as p5 from 'p5';
import ShortUniqueId from 'short-unique-id';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from './constants';

interface P {
  p: p5;
}

interface IGetRandomInt extends P {
  min: number;
  max: number;
}

interface IGetShadeOfGray extends P {
  min?: number;
  max?: number;
}

interface IGenerateClockwiseVertices extends P {
  x: number;
  y: number;
}

export const getRandomInt = ({ min, max, p}: IGetRandomInt): number => (
  p.int(p.random(min, max))
);

export const getShadeOfGray = ({ min = 0, max = 25, p }: IGetShadeOfGray): number => getRandomInt({ min, max, p });

export const generateClockwiseVertices = ({ x, y, p }: IGenerateClockwiseVertices): Array<number[]> => {
  const getXVal = (): number => getRandomInt({ min: 0, max: 4, p });
  const getYVal = (): number => getRandomInt({ min: 0, max: 10, p });

  const v1 = [x - getXVal(), y - getYVal()];
  const v2 = [x + getXVal(), y - getYVal()];
  const v3 = [x + getXVal(), y + getYVal()];
  const v4 = [x - getXVal(), y + getYVal()];
  return [v1, v2, v3, v4];
};

export const getRealMouseCoords = (p: p5): [number, number] => (
  [p.mouseX - (IMAGE_WIDTH / 2), p.mouseY - (IMAGE_HEIGHT / 2)]
);

export const getUid = (): string => {
  const uid = new ShortUniqueId({ length: 7 });
  return uid();
};
