import { e } from 'mathjs';
import { Vertex, Point3D } from '../types';

const lightColor = [1, 1, 1];
const params = {
  kd: 0.6,
  ks: 0.2,
  m: 1,
};

export default function calculateVertexColor(
  vertex: Vertex,
  objectColor: number[],
  lightSources: Point3D[],
  backgroundColor: number[] | null,
  cameraPosition: Point3D | null
) {
  let r = 0;
  let g = 0;
  let b = 0;

  for (const lightPosition of lightSources) {
    const L = calculateL(vertex, lightPosition);
    const prodNL = prod(vertex.vectorSpace!, L);
    const cosNL = Math.max(prodNL, 0);
    const Rz = 2 * prodNL * (vertex.vectorSpace!.z - L.z);
    const cosVR = Math.max(Rz, 0);
    r += calculateColorAtIndex(0, cosNL, cosVR) * 255;
    g += calculateColorAtIndex(1, cosNL, cosVR) * 255;
    b += calculateColorAtIndex(2, cosNL, cosVR) * 255;
  }

  if (backgroundColor)
    [r, g, b] = addFog(r, g, b, cameraPosition!, vertex, backgroundColor);

  return [r << 0, g << 0, b << 0, 255];

  function calculateColorAtIndex(i: number, cosNL: number, cosVR: number) {
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

function addFog(
  r: number,
  g: number,
  b: number,
  cameraPosition: Point3D,
  vertex: Vertex,
  backgroundColor: number[]
) {
  const diff = {
    x: cameraPosition!.x - vertex.space!.x,
    y: cameraPosition!.y - vertex.space!.y,
    z: cameraPosition!.z - vertex.space!.z,
  };

  const dist = Math.sqrt(
    Math.pow(diff.x, 2) + Math.pow(diff.y, 2) + Math.pow(diff.z, 2)
  );

  const modifier = 1 / Math.pow(e, 0.4 * dist);
  r = modifier * r + (1 - modifier) * backgroundColor[0];
  g = modifier * g + (1 - modifier) * backgroundColor[1];
  b = modifier * b + (1 - modifier) * backgroundColor[2];

  return [r, g, b];
}
