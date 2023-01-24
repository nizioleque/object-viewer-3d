import { Point3D } from './types';

export function parsePoint(vertices: string[] | number[]): Point3D {
  const p: Point3D = { x: 0, y: 0, z: 0 };
  if (typeof vertices[1] === 'string') {
    p.x = parseFloat(vertices[1] as string);
    p.y = parseFloat(vertices[2] as string);
    p.z = parseFloat(vertices[3] as string);
  } else {
    p.x = vertices[1] as number;
    p.y = vertices[2] as number;
    p.z = vertices[3] as number;
  }
  return p;
}
