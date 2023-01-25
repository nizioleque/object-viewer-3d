import { ObjectPosition } from '../types';
import readObjectFile from './readObjectFile';

const { PI } = Math;

export default async function getExampleObjects() {
  const noop = (pos: ObjectPosition) => pos;

  const object1 = await readObjectFile('Jeep.obj', [159, 153, 229]);
  const position1: ObjectPosition = {
    offset: { x: 4.25, y: 2, z: 2 },
    rotation: { x: 0, y: 0, z: PI },
  };

  const object2 = await readObjectFile('Jeep.obj', [205, 176, 230]);
  const position2: ObjectPosition = {
    offset: { x: 5.75, y: 2, z: 2 },
    rotation: { x: 0, y: 0, z: PI },
  };

  const object3 = await readObjectFile('Jeep.obj', [205, 176, 230]);
  const position3: ObjectPosition = {
    offset: { x: 5.75, y: 2, z: 2 },
    rotation: { x: 0, y: 0, z: PI },
  };

  const xStart = 2.25;
  const xEnd = 7.75;
  const xLength = xEnd - xStart;
  const zStart = -1;
  const zEnd = 4;
  const zLength = zEnd - zStart;

  const posFn3 = function (pos: ObjectPosition, t: number): ObjectPosition {
    const rotationTime = (t * 3) % (2 * PI);
    const progress = (rotationTime % (0.5 * PI)) / (0.5 * PI);
    const rotation = { x: 0, y: 0, z: PI };

    if (rotationTime < 0.5 * PI) {
      return {
        rotation: { ...rotation, y: 1.5 * PI },
        offset: {
          x: xStart + xLength * progress,
          y: 2,
          z: zStart,
        },
      };
    }

    if (rotationTime < 1.0 * PI) {
      return {
        rotation: { ...rotation, y: 0 },
        offset: {
          x: xEnd,
          y: 2,
          z: zStart + zLength * progress,
        },
      };
    }

    if (rotationTime < 1.5 * PI) {
      return {
        rotation: { ...rotation, y: 0.5 * PI },
        offset: {
          x: xEnd - xLength * progress,
          y: 2,
          z: zEnd,
        },
      };
    }

    return {
      rotation: { ...rotation, y: 1.0 * PI },
      offset: {
        x: xStart,
        y: 2,
        z: zEnd - zLength * progress,
      },
    };
  };

  return {
    objectData: [object1, object2, object3],
    objectPosition: [position1, position2, position3],
    objectPositionFn: [noop, noop, posFn3],
  };
}
