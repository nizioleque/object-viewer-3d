import { Params } from '../hooks/useParams';
import { Vertex, Point3D } from '../types';

const IL = [1, 1, 1];
const IO = [0.5, 1, 1];

export function calculateColor(
  vertex: Vertex,
  lightPosition: Point3D,
  params: Params
) {
  const L = calculateL(vertex, lightPosition);
  const prodNL = prod(vertex.vector, L);
  const cosNL = Math.max(prodNL, 0);

  const Rz = 2 * prodNL * (vertex.vector.z - L.z);
  const cosVR = Math.max(Rz, 0);

  return [
    (calculateColorAtIndex(0, cosNL, cosVR, params) * 255) << 0,
    (calculateColorAtIndex(1, cosNL, cosVR, params) * 255) << 0,
    (calculateColorAtIndex(2, cosNL, cosVR, params) * 255) << 0,
    255,
  ];
}

function calculateColorAtIndex(
  i: number,
  cosNL: number,
  cosVR: number,
  params: Params
) {
  const I1 = params.kd * IL[i] * IO[i] * cosNL;
  const I2 = params.ks * IL[i] * IL[i] * Math.pow(cosVR, params.m);
  return I1 + I2;
}

function prod(p1: Point3D, p2: Point3D) {
  const res = p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
  return res;
}

function calculateL(vertex: Vertex, lightPosition: Point3D): Point3D {
  const v: Point3D = {
    x: lightPosition.x - vertex.original.x,
    y: lightPosition.y - vertex.original.y,
    z: lightPosition.z - vertex.original.z,
  };
  const len = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}
