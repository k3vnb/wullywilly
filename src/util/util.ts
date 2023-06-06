import * as p5 from 'p5';

interface P {
  p: p5;
}

interface IGetRandomInt extends P {
  min: number;
  max: number;
}

interface IGenerateClockwiseVertices extends P {
  x: number;
  y: number;
}

interface IGetRealMouseCoords extends P {
  imageHeight: number;
  imageWidth: number;
}

export const getRandomInt = ({ min, max, p}: IGetRandomInt): number => (
  p.int(p.random(min, max))
);

export const generateClockwiseVertices = ({ x, y, p }: IGenerateClockwiseVertices): Array<number[]> => {
  const getXVal = (): number => getRandomInt({ min: 0, max: 4, p });
  const getYVal = (): number => getRandomInt({ min: 0, max: 10, p });

  const v1 = [x - getXVal(), y - getYVal()];
  const v2 = [x + getXVal(), y - getYVal()];
  const v3 = [x + getXVal(), y + getYVal()];
  const v4 = [x - getXVal(), y + getYVal()];
  return [v1, v2, v3, v4];
};

export const getRealMouseCoords = ({ imageHeight, imageWidth, p }: IGetRealMouseCoords): [number, number] => (
  [p.mouseX - (imageWidth / 2), p.mouseY - (imageHeight / 2)]
);
