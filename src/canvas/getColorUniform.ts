import { Point3D, Vertex } from '../types';
import calculateColor from './calculateColor';

export default function getColorUniform(face: Vertex[], color: number[]) {
  const centerVector: Point3D = {
    x:
      (face[0].vectorSpace!.x +
        face[1].vectorSpace!.x +
        face[2].vectorSpace!.x) /
      3,
    y:
      (face[0].vectorSpace!.y +
        face[1].vectorSpace!.y +
        face[2].vectorSpace!.y) /
      3,
    z:
      (face[0].vectorSpace!.z +
        face[1].vectorSpace!.z +
        face[2].vectorSpace!.z) /
      3,
  };

  const centerSpace: Point3D = {
    x: (face[0].space!.x + face[1].space!.x + face[2].space!.x) / 3,
    y: (face[0].space!.y + face[1].space!.y + face[2].space!.y) / 3,
    z: (face[0].space!.z + face[1].space!.z + face[2].space!.z) / 3,
  };

  const p0 = { x: 0, y: 0, z: 0 };

  return calculateColor(
    {
      space: centerSpace,
      vectorSpace: centerVector,
      vector: p0,
      ...p0,
    },
    color
  );
}
