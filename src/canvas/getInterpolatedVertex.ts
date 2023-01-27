import { Point3D, Vertex } from '../types';

const p0 = { x: 0, y: 0, z: 0 };

export default function getInterpolatedVertex(vertices: Vertex[]) {
  const centerVector: Point3D = {
    x:
      (vertices[0].vectorSpace!.x +
        vertices[1].vectorSpace!.x +
        vertices[2].vectorSpace!.x) /
      3,
    y:
      (vertices[0].vectorSpace!.y +
        vertices[1].vectorSpace!.y +
        vertices[2].vectorSpace!.y) /
      3,
    z:
      (vertices[0].vectorSpace!.z +
        vertices[1].vectorSpace!.z +
        vertices[2].vectorSpace!.z) /
      3,
  };

  const centerSpace: Point3D = {
    x: (vertices[0].space!.x + vertices[1].space!.x + vertices[2].space!.x) / 3,
    y: (vertices[0].space!.y + vertices[1].space!.y + vertices[2].space!.y) / 3,
    z: (vertices[0].space!.z + vertices[1].space!.z + vertices[2].space!.z) / 3,
  };

  return {
    space: centerSpace,
    vectorSpace: centerVector,
    vector: p0,
    ...p0,
  };
}
