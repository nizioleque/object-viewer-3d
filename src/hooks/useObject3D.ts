import { useEffect, useState } from 'react';
import { Point3D } from '../types';
import { parsePoint } from '../utils';

export interface ObjectData3D {
  vertices: Vertex3D[];
  faces: number[][];
  rotationModifier: number;
  color: number[];
}

export interface Vertex3D {
  x: number;
  y: number;
  z: number;
  vector: Point3D;
}

export default function useObject3D() {
  const [objectData3D, setObjectData3D] = useState<ObjectData3D[]>([]);

  useEffect(() => {
    setExampleObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setExampleObjects = async () => {
    const object1 = await readObjectFile(
      'torus_small.obj',
      1,
      {
        x: 0,
        y: 0,
        z: 0,
      },
      [255, 0, 0]
    );
    const object2 = await readObjectFile(
      'torus_small.obj',
      -2,
      {
        x: -0.1,
        y: 0,
        z: 0,
      },
      [0, 255, 0]
    );
    console.log('setting object data 3d to', [object1, object2]);
    setObjectData3D([object1, object2]);
  };

  const readObjectFile = async (
    filename: string,
    rotationModifier: number,
    offset: Point3D,
    color: number[]
  ): Promise<ObjectData3D> => {
    const file: Blob = await loadFile(filename);
    const { vertices, faces } = await parseFile(file, offset);
    console.log(vertices, faces);
    return { vertices, faces, rotationModifier, color };
  };

  const loadFile = async (filename: string) => {
    const res = await fetch(filename);
    const blob = await res.blob();
    return blob;
  };

  const parseFile = async (file: Blob, offset: Point3D) => {
    const faceData: string[][] = [];
    const vertices: Point3D[] = [];
    const vectors: Point3D[] = [];
    const verticesParsed: Vertex3D[] = [];
    const faces: number[][] = [];

    const readObjectDataString = await file.text();
    const readObjectData = readObjectDataString.split('\n');

    for (const line of readObjectData) {
      const lineContent = line.split(' ');
      switch (lineContent[0]) {
        case 'v':
          vertices.push(parsePoint(lineContent));
          break;
        case 'vn':
          vectors.push(parsePoint(lineContent));
          break;
        case 'f':
          faceData.push(lineContent);
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

    for (const faceIndex in faceData) {
      const newFace = [];
      for (const vertex of faceData[parseInt(faceIndex)]) {
        const index = vertex.split('//');
        if (index.length !== 2) continue;

        // get indices
        const vIndex = parseInt(index[0]) - 1;
        const vnIndex = parseInt(index[1]) - 1;

        // get objects
        const v = vertices[vIndex];
        const vn = vectors[vnIndex];

        const newLen = verticesParsed.push({
          ...v,
          vector: vn,
        });

        newFace.push(newLen - 1);
      }
      faces.push(newFace);
    }
    return { vertices: verticesParsed, faces };
  };

  return { objectData3D };
}
