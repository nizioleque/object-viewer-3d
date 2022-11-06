import { useState } from 'react';
import { Face, ObjectData, Vertex } from '../types';

export default function useObjectData() {
  const [objectData, _setObjectData] = useState<ObjectData>();

  const readFile = (file: File) => {
    _setObjectData(undefined);
    parseFile(file);
  };

  const parseFile = async (file: File) => {
    const vertices: string[][] = [];
    const normalVectors: string[][] = [];
    const faces: string[][] = [];
    const newObjectData: ObjectData = new ObjectData([]);

    const readObjectDataString = await file.text();
    const readObjectData = readObjectDataString.split('\n');

    for (const line of readObjectData) {
      const lineContent = line.split(' ');
      switch (lineContent[0]) {
        case 'v':
          vertices.push(lineContent);
          break;
        case 'vn':
          normalVectors.push(lineContent);
          break;
        case 'f':
          faces.push(lineContent);
          break;
      }
    }

    for (const faceIndex in faces) {
      const verticesParsed: Vertex[] = [];

      for (const vertex of faces[parseInt(faceIndex)]) {
        const index = vertex.split('//');
        if (index.length !== 2) continue;
        const v = vertices[parseInt(index[0]) - 1];
        const vn = normalVectors[parseInt(index[1]) - 1];
        verticesParsed.push(new Vertex(v, vn));
      }

      newObjectData.faces.push(new Face(verticesParsed, parseInt(faceIndex)));
    }

    _setObjectData(newObjectData);
  };

  return { objectData, readFile };
}
