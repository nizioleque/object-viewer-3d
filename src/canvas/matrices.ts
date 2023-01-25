import { matrix, cos, sin } from 'mathjs';
import { ObjectPosition } from '../types';

export const getRotationMatrix = ({ rotation: r }: ObjectPosition) =>
  matrix([
    [
      cos(r.z) * cos(r.y),
      cos(r.z) * sin(r.y) * sin(r.x) - sin(r.z) * cos(r.x),
      cos(r.z) * sin(r.y) * cos(r.x) + sin(r.z) * sin(r.x),
      0,
    ],
    [
      sin(r.z) * cos(r.y),
      sin(r.z) * sin(r.y) * sin(r.x) + cos(r.z) * cos(r.x),
      sin(r.z) * sin(r.y) * cos(r.x) - cos(r.z) * sin(r.x),
      0,
    ],
    [-sin(r.y), cos(r.y) * sin(r.x), cos(r.y) * cos(r.x), 0],
    [0, 0, 0, 1],
  ]);

export const getTranslationMatrix = ({ offset: o }: ObjectPosition) =>
  matrix([
    [1, 0, 0, o.x],
    [0, 1, 0, o.y],
    [0, 0, 1, o.z],
    [0, 0, 0, 1],
  ]);

export const getProjectionMatrix = (fov: number) => {
  const fovRad = fov * 0.01745329252;
  const e = 1 / Math.tan(fovRad / 2);
  const a = 1; // aspect ratio
  const n = 1; //near
  const f = 10; //far

  return matrix([
    [e, 0, 0, 0],
    [0, e / a, 0, 0],
    [0, 0, -(f + n) / (f - n), (-2 * f * n) / (f - n)],
    [0, 0, -1, 0],
  ]);
};
