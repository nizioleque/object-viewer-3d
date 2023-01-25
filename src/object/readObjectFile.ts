import { ObjectData3D, Point3D } from '../types';
import { parsePoint } from '../utils';

export default async function readObjectFile(
  filename: string,
  color: number[]
): Promise<ObjectData3D> {
  const file: Blob = await loadFile(filename);
  const { vertices, faces } = await parseFile(file);
  return { vertices, faces, color };
}

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
