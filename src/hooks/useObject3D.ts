import { useEffect } from 'react';
import { objectDataState, objectPositionState } from '../atoms';
import { ObjectData3D, ObjectPosition, Point3D } from '../types';
import { parsePoint } from '../utils';
import { useSetRecoilState } from 'recoil';

export default function useObject3D() {
  const setObjectData3D = useSetRecoilState(objectDataState);
  const setObjectPositionState = useSetRecoilState(objectPositionState);

  useEffect(() => {
    setExampleObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setExampleObjects = async () => {
    const object1 = await readObjectFile('Jeep.obj', [0, 0, 0]);
    const position1: ObjectPosition = {
      offset: { x: 4.25, y: 2, z: 2 },
      rotation: { x: 0, y: 0, z: Math.PI },
      rotationModifier: 1,
    };
    const object2 = await readObjectFile('Jeep.obj', [0, 255, 0]);
    const position2: ObjectPosition = {
      offset: { x: 5.75, y: 2, z: 2 },
      rotation: { x: 0, y: 0, z: Math.PI },
      rotationModifier: -2,
    };
    console.log('setting object data 3d to', [object1, object2]);
    setObjectData3D([object1, object2]);
    setObjectPositionState([position1, position2]);
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
