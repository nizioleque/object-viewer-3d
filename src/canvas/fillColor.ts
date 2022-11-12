import { Params } from '../hooks/useParams';
import { StyleOptions } from '../hooks/useStyleOptions';
import { Vertex, Point3D } from '../types';

export function calculateColor(
  vertex: Vertex,
  lightPosition: Point3D,
  params: Params,
  styleOptions: StyleOptions
) {
  const L = calculateL(vertex, lightPosition);
  const prodNL = prod(vertex.vector, L);
  const cosNL = Math.max(prodNL, 0);

  const Rz = 2 * prodNL * (vertex.vector.z - L.z);
  const cosVR = Math.max(Rz, 0);

  return [
    (calculateColorAtIndex(0, cosNL, cosVR, params, styleOptions) * 255) << 0,
    (calculateColorAtIndex(1, cosNL, cosVR, params, styleOptions) * 255) << 0,
    (calculateColorAtIndex(2, cosNL, cosVR, params, styleOptions) * 255) << 0,
    255,
  ];
}

function calculateColorAtIndex(
  i: number,
  cosNL: number,
  cosVR: number,
  params: Params,
  styleOptions: StyleOptions
) {
  const I1 =
    params.kd * styleOptions.lightColor[i] * styleOptions.fillColor[i] * cosNL;
  const I2 =
    params.ks *
    styleOptions.lightColor[i] *
    styleOptions.fillColor[i] *
    Math.pow(cosVR, params.m);
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
