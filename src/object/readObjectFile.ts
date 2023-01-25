import { ObjectData3D, Point3D, Vertex } from '../types';
import { parsePoint } from '../utils';

export default async function readObjectFile(
  filename: string,
  color: number[]
): Promise<ObjectData3D> {
  const file: Blob = await loadFile(filename);
  const faces = await parseFile(file);
  return { faces, color };
}

const loadFile = async (filename: string) => {
  const res = await fetch(filename);
  const blob = await res.blob();
  return blob;
};

const parseFile = async (file: Blob) => {
  const vertices: Point3D[] = [];
  const vectors: Point3D[] = [];
  const faces: { vertex: number; vector: number }[][] = [];
  const facesParsed: Vertex[][] = [];

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
        lineContent.shift();
        faces.push(
          lineContent.map((x) => {
            const split = x.split('/');
            return {
              vertex: parseInt(split[0]) - 1,
              vector: parseInt(split[2]) - 1,
            };
          })
        );
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

  for (const face of faces) {
    facesParsed.push(
      face.map((f) => ({
        ...vertices[f.vertex],
        vector: vertices[f.vector],
      }))
    );
  }

  return facesParsed;
};
