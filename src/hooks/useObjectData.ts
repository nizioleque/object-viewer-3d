import { useState } from 'react';
import { Face, ObjectData, Point3D, Vertex } from '../types';
import { parsePoint, scalePoint } from '../utils';

export default function useObjectData() {
  const [objectData, _setObjectData] = useState<ObjectData>();

  const readObjectFile = (file: Blob) => {
    _setObjectData(undefined);
    parseFile(file);
  };

  const parseFile = async (file: Blob) => {
    const faceData: string[][] = [];
    const vertices: Point3D[] = [];
    const vectors: Point3D[] = [];
    const newObjectData: ObjectData = { faces: [], vertices: [] };

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

    for (const faceIndex in faceData) {
      const verticesParsed: Vertex[] = [];

      for (const vertex of faceData[parseInt(faceIndex)]) {
        const index = vertex.split('//');
        if (index.length !== 2) continue;

        // get indices
        const vIndex = parseInt(index[0]) - 1;
        const vnIndex = parseInt(index[1]) - 1;

        // get objects
        const v = vertices[vIndex];
        const vn = vectors[vnIndex];

        // check if vertex already exists
        const existingVertex: Vertex | undefined =
          newObjectData.vertices[vIndex]?.[vnIndex];

        if (!existingVertex) {
          // create vertex object
          const newVertex = {
            ...scalePoint(v),
            original: v,
            vector: vn,
            color: [0, 0, 0, 255],
          };

          // add vertex to data
          if (!newObjectData.vertices[vIndex])
            newObjectData.vertices[vIndex] = [];
          newObjectData.vertices[vIndex][vnIndex] = newVertex;

          // add vertex to face
          verticesParsed.push(newVertex);
        } else {
          verticesParsed.push(existingVertex);
        }
      }

      newObjectData.faces.push(new Face(verticesParsed));
    }

    _setObjectData(newObjectData);
  };

  return { objectData, readObjectFile };
}
