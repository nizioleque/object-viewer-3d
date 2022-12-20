import { useEffect, useState } from 'react';
import { Point3D } from '../types';
import { parsePoint } from '../utils';

export interface ObjectData3D {
  vertices: Point3D[];
  faces: number[][];
  rotationModifier: number;
}

export default function useObject3D() {
  const [objectData3D, setObjectData3D] = useState<ObjectData3D[]>([]);

  useEffect(() => {
    setExampleObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setExampleObjects = async () => {
    const object1 = await readObjectFile('torus_small.obj', 1, {
      x: -1.2,
      y: 0,
      z: 0,
    });
    const object2 = await readObjectFile('torus_small.obj', -2, {
      x: 1.2,
      y: 0,
      z: 0,
    });
    console.log('setting object data 3d to', [object1, object2]);
    setObjectData3D([object1, object2]);
  };

  const readObjectFile = async (
    filename: string,
    rotationModifier: number,
    offset: Point3D
  ): Promise<ObjectData3D> => {
    const file: Blob = await loadFile(filename);
    const { vertices, faces } = await parseFile(file, offset);
    return { vertices, faces, rotationModifier };
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

  return { objectData3D };
}
