export interface ObjectData {
  vertices: Vertex[][];
  faces: Face[];
}

export class Face {
  vertices: Vertex[];
  edgeTable: EdgeData[][] = [];

  det: number;
  a1: number = 0;
  a2: number = 0;
  b1: number = 0;
  b2: number = 0;

  constructor(vertices: Vertex[]) {
    this.vertices = vertices;
    this.createEdgeTable();

    this.det =
      (this.vertices[1].y - this.vertices[2].y) *
        (this.vertices[0].x - this.vertices[2].x) +
      (this.vertices[2].x - this.vertices[1].x) *
        (this.vertices[0].y - this.vertices[2].y);

    this.a1 = this.vertices[1].y - this.vertices[2].y;
    this.a2 = this.vertices[2].x - this.vertices[1].x;
    this.b1 = this.vertices[2].y - this.vertices[0].y;
    this.b2 = this.vertices[0].x - this.vertices[2].x;
  }

  createEdgeTable() {
    this.edgeTable = [];

    for (let i = 0; i < this.vertices.length; i++) {
      const iNext = (i + 1) % this.vertices.length;

      const leftVertex =
        this.vertices[i].x > this.vertices[iNext].x
          ? this.vertices[iNext]
          : this.vertices[i];
      const rightVertex =
        this.vertices[i] === leftVertex
          ? this.vertices[iNext]
          : this.vertices[i];

      if (leftVertex.y === rightVertex.y) continue;

      const yMinVertex =
        this.vertices[i].y < this.vertices[iNext].y
          ? this.vertices[i]
          : this.vertices[iNext];

      const edgeData: EdgeData = {
        xofYMin: yMinVertex.x,
        yMax: Math.max(this.vertices[i].y, this.vertices[iNext].y),
        slopeInverted:
          (rightVertex.x - leftVertex.x) / (rightVertex.y - leftVertex.y),
      };

      const yMin = yMinVertex.y;
      if (!this.edgeTable[yMin]) this.edgeTable[yMin] = [];

      this.edgeTable[yMin].push(edgeData);
    }
  }
}

export interface Point {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Vertex extends Point3D {
  vector: Point3D;
  original: Point3D;
  color: number[];
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
}

export interface ObjectData3D {
  vertices: Point3D[];
  faces: number[][];
  color: number[];
}

export interface ObjectPosition {
  offset: Point3D;
  rotation: Point3D;
  rotationModifier: number;
}
