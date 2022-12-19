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

export const lookAtMatrix: Matrix = math.matrix([
  [-0.832, 0.555, -7e-17, 0.277],
  [-0.412, -0.618, 0.67, 0.361],
  [0.371, 0.557, 0.743, -4.364],
  [0, 0, 0, 1],
]);

export default function useObject3D() {
  const [objectData3D, setObjectData3D] = useState<ObjectData3D[]>([]);

  useEffect(() => {
    setExampleObjects();
  }, []);

  const setExampleObjects = async () => {
    const object1 = await readObjectFile('torus_full.obj');
    const object2 = await readObjectFile('torus_full.obj');
    console.log('set example objects', object1, object2);
    setObjectData3D([object1, object2]);
  };

  const readObjectFile = async (filename: string): Promise<ObjectData3D> => {
    const file: Blob = await loadFile(filename);
    const { vertices, faces } = await parseFile(file);
    const matrix: (t: number) => Matrix = getModelMatrixFn();
    return { vertices, faces, modelMatrixFn: matrix };
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
      const currentMax = Math.max(Math.abs(vertex.x), Math.abs(vertex.y));
      if (currentMax > maxCoordinate) maxCoordinate = currentMax;
    }

    for (const vertex of vertices) {
      vertex.x /= maxCoordinate;
      vertex.y /= maxCoordinate;
      vertex.z /= maxCoordinate;
    }

    console.log(vertices, faces);
    return { vertices, faces };
  };

  const getModelMatrixFn = () => (t: number) =>
    math.matrix([
      [1, 0, 0, 0],
      [0, Math.cos(t), -Math.sin(t), 0],
      [0, Math.sin(t), Math.cos(t), 0],
      [0, 0, 0, 1],
    ]);

  return { objectData3D };
}
