import { Vertex, Point3D } from '../types';

const lightColor = [1, 1, 1];
const params = {
  kd: 1,
  ks: 1,
  m: 2,
};

export const lightPosition: Point3D = {
  x: 3,
  y: -0.5,
  z: 4.5,
};

export default function calculateVertexColor(
  vertex: Vertex,
  objectColor: number[]
) {
  const L = calculateL(vertex, lightPosition);
  const prodNL = prod(vertex.vectorSpace!, L);
  const cosNL = Math.max(prodNL, 0);
  const Rz = 2 * prodNL * (vertex.vectorSpace!.z - L.z);
  const cosVR = Math.max(Rz, 0);

  return [
    (calculateColorAtIndex(0) * 255) << 0,
    (calculateColorAtIndex(1) * 255) << 0,
    (calculateColorAtIndex(2) * 255) << 0,
    255,
  ];

  function calculateColorAtIndex(i: number) {
    const I1 = params.kd * lightColor[i] * objectColor[i] * cosNL;
    const I2 =
      params.ks * lightColor[i] * objectColor[i] * Math.pow(cosVR, params.m);
    return I1 + I2;
  }
}

function prod(p1: Point3D, p2: Point3D) {
  const res = p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
  return res;
}

function calculateL(vertex: Vertex, lightPosition: Point3D): Point3D {
  const v: Point3D = {
    x: lightPosition.x - vertex.space!.x,
    y: lightPosition.y - vertex.space!.y,
    z: lightPosition.z - vertex.space!.z,
  };
  return normalizeVector(v);
}

export function normalizeVector(v: Point3D): Point3D {
  const len = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}
