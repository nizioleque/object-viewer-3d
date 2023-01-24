import { useEffect } from 'react';
import {
  objectDataState,
  objectPositionFnState,
  objectPositionState,
} from '../atoms';
import { ObjectData3D, ObjectPosition, Point3D } from '../types';
import { parsePoint } from '../utils';
import { useSetRecoilState } from 'recoil';

const { PI } = Math;

export default function useObject3D() {
  const setObjectData3D = useSetRecoilState(objectDataState);
  const setObjectPositionState = useSetRecoilState(objectPositionState);
  const setObjectPositionFnState = useSetRecoilState(objectPositionFnState);

  useEffect(() => {
    setExampleObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setExampleObjects = async () => {
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

      // pos.offset.x = x;
      // return { ...pos, offset: { ...pos.offset, x } };
    };

    console.log('setting object data 3d to', [object1, object2]);
    setObjectData3D([object1, object2, object3]);
    setObjectPositionState([position1, position2, position3]);
    setObjectPositionFnState([noop, noop, posFn3]);
  };

  const readObjectFile = async (
    filename: string,
    color: number[]
  ): Promise<ObjectData3D> => {
    const file: Blob = await loadFile(filename);
    const { vertices, faces } = await parseFile(file);
    return { vertices, faces, color };
  };

  const loadFile = async (filename: string) => {
    const res = await fetch(filename);
    const blob = await res.blob();
    return blob;
  };

  const parseFile = async (file: Blob) => {
    const vertices: Point3D[] = [];
    const faces: number[][] = [];

    const readObjectDataString = await file.text();
    const readObjectData = readObjectDataString.split('\n');

    for (const line of readObjectData) {
      const lineContent = line.split(' ');
      switch (lineContent[0]) {
        case 'v':
          vertices.push(parsePoint(lineContent));
          break;
        case 'f':
          faces.push(lineContent.map((x) => parseInt(x.split('//')[0])));
          break;
      }
    }

    let maxCoordinate = 0;
    for (const vertex of vertices) {
      const currentMax = Math.max(
        Math.abs(vertex.x),
        Math.abs(vertex.y),
        Math.abs(vertex.z)
      );
      if (currentMax > maxCoordinate) maxCoordinate = currentMax;
    }

    for (const vertex of vertices) {
      vertex.x /= maxCoordinate;
      vertex.y /= maxCoordinate;
      vertex.z /= maxCoordinate;
    }

    return { vertices, faces };
  };
}
