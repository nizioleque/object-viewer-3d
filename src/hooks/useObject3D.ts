import * as math from 'mathjs';
import { Matrix } from 'mathjs';
import { useEffect, useState } from 'react';
import { Point3D } from '../types';
import { parsePoint } from '../utils';

export interface ObjectData3D {
  vertices: Point3D[];
  faces: number[][];
  modelMatrixFn: (t: number) => Matrix;
}

export const viewMatrix: Matrix = math.matrix([
  [-0.986, 0.164, 4e-18, -1e-16],
  [-0.027, -0.16, 0.987, 1e-16],
  [0.162, 0.973, 0.162, -3.082],
  [0, 0, 0, 1],
]);

export default function useObject3D() {
  const [objectData3D, setObjectData3D] = useState<ObjectData3D[]>([]);

  useEffect(() => {
    setExampleObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setExampleObjects = async () => {
    const object1 = await readObjectFile('torus_full.obj', 1, {
      x: -1.2,
      y: 0,
      z: 0,
    });
    const object2 = await readObjectFile('torus_full.obj', -2, {
      x: 1.2,
      y: 0,
      z: 0,
    });
    setObjectData3D([object1, object2]);
  };

  const readObjectFile = async (
    filename: string,
    rotationModifier: number,
    offset: Point3D
  ): Promise<ObjectData3D> => {
    const file: Blob = await loadFile(filename);
    const { vertices, faces } = await parseFile(file, offset);
    const matrix: (t: number) => Matrix = getModelMatrixFn(rotationModifier);
    return { vertices, faces, modelMatrixFn: matrix };
  };

  const loadFile = async (filename: string) => {
    const res = await fetch(filename);
    const blob = await res.blob();
    return blob;
  };

  const parseFile = async (file: Blob, offset: Point3D) => {
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
      const currentMax = Math.max(Math.abs(vertex.x), Math.abs(vertex.y));
      if (currentMax > maxCoordinate) maxCoordinate = currentMax;
    }

    for (const vertex of vertices) {
      vertex.x /= maxCoordinate;
      vertex.y /= maxCoordinate;
      vertex.z /= maxCoordinate;

      vertex.x += offset.x;
      vertex.y += offset.y;
      vertex.z += offset.z;
    }

    return { vertices, faces };
  };

  const getModelMatrixFn = (rotationModifier: number) => (t: number) =>
    math.matrix([
      [1, 0, 0, 0],
      [0, Math.cos(t * rotationModifier), -Math.sin(t * rotationModifier), 0],
      [0, Math.sin(t * rotationModifier), Math.cos(t * rotationModifier), 0],
      [0, 0, 0, 1],
    ]);

  return { objectData3D };
}
