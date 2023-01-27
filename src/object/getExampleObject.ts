import { ObjectPosition, Point3D } from '../types';
import readObjectFile from './readObjectFile';

const { PI } = Math;

export default async function getExampleObjects(lightSources: Point3D[]) {
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

  const object3 = await readObjectFile('Jeep.obj', [227, 57, 111]);
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

  const object4 = await readObjectFile('cube.obj', [255, 255, 0], 0.05);
  const position4: ObjectPosition = {
    offset: lightSources[0],
    rotation: { x: 0.25 * PI, y: 0.25 * PI, z: 0.75 * PI },
  };

  const object5 = await readObjectFile('sphere.obj', [255, 0, 0], 1.25);
  const position5: ObjectPosition = {
    offset: { x: 7.5, y: 2, z: -1 },
    rotation: { x: 0, y: 0, z: 0 },
  };

  const object6 = await readObjectFile('cube.obj', [255, 255, 0], 0.05);
  const position6: ObjectPosition = {
    offset: { x: 5.75, y: 2, z: 2 },
    rotation: { x: 0, y: 0, z: PI },
  };

  const posFn6 = function (pos: ObjectPosition, t: number): ObjectPosition {
    const rotationTime = (t * 3) % (2 * PI);
    const progress = (rotationTime % (0.5 * PI)) / (0.5 * PI);
    const rotation = { x: 0, y: 0, z: PI };
    const offsetFront = 0.9;

    if (rotationTime < 0.5 * PI) {
      return {
        rotation: { ...rotation, y: 1.5 * PI },
        offset: {
          x: xStart + xLength * progress + offsetFront,
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
          z: zStart + zLength * progress + offsetFront,
        },
      };
    }

    if (rotationTime < 1.5 * PI) {
      return {
        rotation: { ...rotation, y: 0.5 * PI },
        offset: {
          x: xEnd - xLength * progress - offsetFront,
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
        z: zEnd - zLength * progress - offsetFront,
      },
    };
  };

  const object7 = await readObjectFile('cube.obj', [255, 255, 0], 0.05);
  const position7: ObjectPosition = {
    offset: lightSources[2],
    rotation: { x: 0.25 * PI, y: 0.25 * PI, z: 0.75 * PI },
  };

  return {
    objectData: [object1, object2, object3, object4, object5, object6, object7],
    objectPosition: [
      position1,
      position2,
      position3,
      position4,
      position5,
      position6,
      position7,
    ],
    objectPositionFn: [noop, noop, posFn3, noop, noop, posFn6, noop],
  };
}
