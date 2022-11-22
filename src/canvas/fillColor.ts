import { MapType } from '../hooks/useNormalMap';
import { Params } from '../hooks/useParams';
import { FillType, StyleOptions } from '../hooks/useStyleOptions';
import { Vertex, Point3D } from '../types';

export function calculateColor(
  vertex: Vertex,
  lightPosition: Point3D,
  params: Params,
  styleOptions: StyleOptions,
  texture: number[] | undefined,
  normalMap: number[] | null,
  size: number,
  mapType: MapType
) {
  const offset = (vertex.y * size + vertex.x) * 4;

  const normalVector = normalMap
    ? getMappedVector(normalMap, vertex, mapType, size)
    : vertex.vector;

  let fillColor: number[] | Uint8ClampedArray;
  if (styleOptions.fillType === FillType.Texture && texture) {
    fillColor = texture.slice(offset, offset + 3);
  } else {
    fillColor = styleOptions.fillColor;
  }

  const L = calculateL(vertex, lightPosition);
  const prodNL = prod(normalVector, L);
  const cosNL = Math.max(prodNL, 0);
  const Rz = 2 * prodNL * (normalVector.z - L.z);
  const cosVR = Math.max(Rz, 0);

  return [
    (calculateColorAtIndex(0) * 255) << 0,
    (calculateColorAtIndex(1) * 255) << 0,
    (calculateColorAtIndex(2) * 255) << 0,
    255,
  ];

  function calculateColorAtIndex(i: number) {
    const I1 = params.kd * styleOptions.lightColor[i] * fillColor[i] * cosNL;
    const I2 =
      params.ks *
      styleOptions.lightColor[i] *
      fillColor[i] *
      Math.pow(cosVR, params.m);
    return I1 + I2;
  }
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
  return normalizeVector(v);
}

const v001 = { x: 0, y: 0, z: 1 };

function getMappedVector(
  normalMap: number[],
  vertex: Vertex,
  mapType: MapType,
  size: number
): Point3D {
  if (mapType === MapType.NormalMap) {
    const offset = (vertex.y * size + vertex.x) * 4;
    const normalMapColor = normalMap?.slice(offset, offset + 3);
    return calculateNormalMap(normalMapColor);
  }

  if (mapType === MapType.HeightMap) {
    if (vertex.x >= size - 1 || vertex.y >= size - 1) {
      console.log('no');
      return vertex.vector;
    }
    const offsetCurrent = (vertex.y * size + vertex.x) * 4;
    const colorCurrent = normalMap[offsetCurrent + 2];

    const offsetRight = (vertex.y * size + vertex.x + 1) * 4;
    const colorRight = normalMap[offsetRight + 2];

    const offsetBelow = ((vertex.y + 1) * size + vertex.x) * 4;
    const colorBelow = normalMap[offsetBelow + 2];

    return calculateHeightMap(colorCurrent, colorRight, colorBelow);
  }

  return { x: 0, y: 0, z: 0 };

  function calculateHeightMap(
    colorCurrent: number,
    colorRight: number,
    colorBelow: number
  ) {
    const alpha = 10;

    const deltaX = colorRight - colorCurrent;
    const deltaY = colorBelow - colorCurrent;

    const nSurface = vertex.vector;
    const b = crossProduct(nSurface, v001);
    const t = crossProduct(b, nSurface);

    const d: Point3D = {
      x: deltaX * t.x + deltaY * b.x,
      y: deltaX * t.y + deltaY * b.y,
      z: deltaX * t.z + deltaY * b.z,
    };

    return normalizeVector({
      x: vertex.vector.x + alpha * d.x,
      y: vertex.vector.y + alpha * d.y,
      z: Math.max(vertex.vector.z + alpha * d.z, 0),
    });
  }

  function calculateNormalMap(normalMapColor: number[]) {
    const nTexture = {
      x: normalMapColor[0],
      y: normalMapColor[1],
      z: normalMapColor[2],
    };
    const nSurface = vertex.vector;
    const b = crossProduct(nSurface, v001);
    const t = crossProduct(b, nSurface);

    return normalizeVector({
      x: t.x * nTexture.x + b.x * nTexture.y + nSurface.x * nTexture.z,
      y: t.y * nTexture.x + b.y * nTexture.y + nSurface.y * nTexture.z,
      z: t.z * nTexture.x + b.z * nTexture.y + nSurface.z * nTexture.z,
    });
  }
}

function crossProduct(p1: Point3D, p2: Point3D): Point3D {
  return {
    x: p1.y * p2.z - p1.z * p2.y,
    y: p1.z * p2.x - p1.x * p2.z,
    z: p1.x * p2.y - p1.y * p2.x,
  };
}

function normalizeVector(v: Point3D): Point3D {
  const len = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}
