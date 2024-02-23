import * as p5 from 'p5';

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

export function getRandomInt({ min, max, p}: IGetRandomInt) {
  return p.int(p.random(min, max));
}

export function getShadeOfGray({ min = 0, max = 25, p }: IGetShadeOfGray) {
  return getRandomInt({ min, max, p });
}

const SMALL_OFFSET = 0.1; // non-zero small number

const cacheX: number[] = [];
const cacheY: number[] = [];
let cachedIdx = 0;

function getRandom(min: number, max: number, cache: number[], p: p5) {
  if (cache.length < 900) {
    const val = getRandomInt({ min, max, p });
    cache.push(val);
    return val;
  }
  const idx = cachedIdx++ % cache.length;
  return cache[idx];
}

export function generateClockwiseVertices ({ x, y, p }: IGenerateClockwiseVertices){
  function getXVal(){
    return getRandom(0, 4, cacheX, p) + SMALL_OFFSET;
  }

  function getYVal(){
    return getRandom(1, 10, cacheY, p);
  }

  const v1 = [x - getXVal(), y - getYVal()];
  const v2 = [x + getXVal(), y - getYVal()];
  const v3 = [x + getXVal(), y + getYVal()];
  const v4 = [x - getXVal(), y + getYVal()];
  return [v1, v2, v3, v4];
}

export function getRealMouseCoords(p: p5) {
  return [p.mouseX - (p.width / 2), p.mouseY - (p.height / 2)];
}
