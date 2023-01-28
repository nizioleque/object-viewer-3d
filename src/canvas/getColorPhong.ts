import { Face, Point3D } from '../types';
import calculateVertexColor from './calculateVertexColor';

const p0 = { x: 0, y: 0, z: 0 };

export default function getColorPhong(
  face: Face,
  alpha: number,
  beta: number,
  gamma: number,
  objectColor: number[],
  lightSources: Point3D[],
  backgroundColor: number[] | null,
  cameraPosition: Point3D | null
) {
  const xPoint =
    face.vertices[0].space!.x * alpha +
    face.vertices[1].space!.x * beta +
    face.vertices[2].space!.x * gamma;
  const yPoint =
    face.vertices[0].space!.y * alpha +
    face.vertices[1].space!.y * beta +
    face.vertices[2].space!.y * gamma;
  const zPoint =
    face.vertices[0].space!.z * alpha +
    face.vertices[1].space!.z * beta +
    face.vertices[2].space!.z * gamma;

  const xVector =
    face.vertices[0].vectorSpace!.x * alpha +
    face.vertices[1].vectorSpace!.x * beta +
    face.vertices[2].vectorSpace!.x * gamma;
  const yVector =
    face.vertices[0].vectorSpace!.y * alpha +
    face.vertices[1].vectorSpace!.y * beta +
    face.vertices[2].vectorSpace!.y * gamma;
  const zVector =
    face.vertices[0].vectorSpace!.z * alpha +
    face.vertices[1].vectorSpace!.z * beta +
    face.vertices[2].vectorSpace!.z * gamma;

  return calculateVertexColor(
    {
      space: { x: xPoint, y: yPoint, z: zPoint },
      vectorSpace: { x: xVector, y: yVector, z: zVector },
      vector: p0,
      ...p0,
    },
    objectColor,
    lightSources,
    backgroundColor,
    cameraPosition
  );
}
