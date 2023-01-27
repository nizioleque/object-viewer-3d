import { Face } from '../types';

export default function getColorGouraud(
  face: Face,
  alpha: number,
  beta: number,
  gamma: number
) {
  if (!face.vertices[1].color) return [255, 0, 0, 255];

  const r =
    (face.vertices[0].color![0] * alpha +
      face.vertices[1].color![0] * beta +
      face.vertices[2].color![0] * gamma) <<
    0;
  const g =
    (face.vertices[0].color![1] * alpha +
      face.vertices[1].color![1] * beta +
      face.vertices[2].color![1] * gamma) <<
    0;
  const b =
    (face.vertices[0].color![2] * alpha +
      face.vertices[1].color![2] * beta +
      face.vertices[2].color![2] * gamma) <<
    0;

  return [r, g, b, 255];
}
