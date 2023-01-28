import { matrix, cos, sin, inv, multiply } from 'mathjs';
import { ObjectPosition, Point3D } from '../types';
import { normalizeVector } from './calculateVertexColor';

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
  const f = 20; //far

  return matrix([
    [e, 0, 0, 0],
    [0, e / a, 0, 0],
    [0, 0, -(f + n) / (f - n), (-2 * f * n) / (f - n)],
    [0, 0, -1, 0],
  ]);
};

// camera position: 5, -2, 5
// camera target: 5, 5, 0
export const viewMatrixUp = matrix([
  [1, 0, 0, -5],
  [0, 0.581238194, 0.813733471, -2.906190969],
  [0, -0.813733471, 0.581238194, -4.533657911],
  [0, 0, 0, 1],
]);

export const viewMatrixFollowing = (cameraTarget: Point3D) => {
  const cameraPosition = {
    x: -3,
    y: -0.5,
    z: 3,
  };
  const upVector = { x: 0, y: 1, z: 0 };

  const zAxis = normalizeVector({
    x: cameraPosition.x - cameraTarget.x,
    y: cameraPosition.y - cameraTarget.y,
    z: cameraPosition.z - cameraTarget.z,
  });

  const xAxis = normalizeVector({
    x: upVector.y * zAxis.z - upVector.z * zAxis.y,
    y: upVector.z * zAxis.x - upVector.x * zAxis.z,
    z: upVector.x * zAxis.y - upVector.y * zAxis.x,
  });

  const yAxis = {
    x: zAxis.y * xAxis.z - zAxis.z * xAxis.y,
    y: zAxis.z * xAxis.x - zAxis.x * xAxis.z,
    z: zAxis.x * xAxis.y - zAxis.y * xAxis.z,
  };

  const viewMatrixInv = matrix([
    [xAxis.x, yAxis.x, zAxis.x, cameraPosition.x],
    [xAxis.y, yAxis.y, zAxis.y, cameraPosition.y],
    [xAxis.z, yAxis.z, zAxis.z, cameraPosition.z],
    [0, 0, 0, 1],
  ]);

  return inv(viewMatrixInv);
};

export const viewMatrixMoving = (
  objectPosition: Point3D,
  cameraDirection: Point3D
) => {
  const vector = matrix([[0], [0], [1], [1]]);
  const cameraTargetOffset = multiply(
    getRotationMatrix({
      rotation: cameraDirection,
      offset: { x: 0, y: 0, z: 0 },
    }),
    vector
  );

  const cameraPosition = {
    x: objectPosition.x - 3 * cameraTargetOffset.get([0, 0]),
    y: objectPosition.y - 1.5,
    z: objectPosition.z - 3 * cameraTargetOffset.get([2, 0]),
  };

  const cameraTarget = {
    x: objectPosition.x + cameraTargetOffset.get([0, 0]),
    y: cameraPosition.y,
    z: objectPosition.z + cameraTargetOffset.get([2, 0]),
  };

  const upVector = { x: 0, y: 1, z: 0 };

  const zAxis = normalizeVector({
    x: cameraPosition.x - cameraTarget.x,
    y: cameraPosition.y - cameraTarget.y,
    z: cameraPosition.z - cameraTarget.z,
  });

  const xAxis = normalizeVector({
    x: upVector.y * zAxis.z - upVector.z * zAxis.y,
    y: upVector.z * zAxis.x - upVector.x * zAxis.z,
    z: upVector.x * zAxis.y - upVector.y * zAxis.x,
  });

  const yAxis = {
    x: zAxis.y * xAxis.z - zAxis.z * xAxis.y,
    y: zAxis.z * xAxis.x - zAxis.x * xAxis.z,
    z: zAxis.x * xAxis.y - zAxis.y * xAxis.z,
  };

  const viewMatrixInv = matrix([
    [xAxis.x, yAxis.x, zAxis.x, cameraPosition.x],
    [xAxis.y, yAxis.y, zAxis.y, cameraPosition.y],
    [xAxis.z, yAxis.z, zAxis.z, cameraPosition.z],
    [0, 0, 0, 1],
  ]);

  return { viewMatrix: inv(viewMatrixInv), cameraPosition };
};
