export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface EdgeData {
  yMax: number;
  xofYMin: number;
  slopeInverted: number;
}

export interface ActiveEdgeData {
  edgeData: EdgeData;
  x: number;
}

export interface DrawArgs3D {
  fov: number;
  objectPosition: ObjectPosition[];
  scale: number;
  fillMode: FillMode;
}

export interface Face {
  vertices: Vertex[];
}

export interface Vertex extends Point3D {
  vector: Point3D;
  vectorSpace?: Point3D;
  space?: Point3D;
  screen?: Point3D;
  color?: number[];
}

export interface ObjectData3D {
  faces: Face[];
  color: number[];
}

export interface ObjectPosition {
  offset: Point3D;
  rotation: Point3D;
}

export type ObjectPositionFn = (
  pos: ObjectPosition,
  t: number
) => ObjectPosition;

export enum FillMode {
  Uniform,
  Gouraud,
  Phong,
}
