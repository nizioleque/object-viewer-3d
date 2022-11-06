import { scale } from './constants';

export class ObjectData {
  faces: Face[];

  constructor(faces: Face[]) {
    this.faces = faces;
  }
}

export class Face {
  vertices: Vertex[];
  edgeTable: EdgeData[][] = [];

  constructor(vertices: Vertex[]) {
    this.vertices = vertices;
    this.createEdgeTable();
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
        this.vertices[i].x < this.vertices[iNext].x
          ? this.vertices[iNext]
          : this.vertices[i];

      const yMinVertex =
        this.vertices[i].y < this.vertices[iNext].y
          ? this.vertices[i]
          : this.vertices[iNext];

      const edgeData: EdgeData = {
        xMin: yMinVertex.x,
        yMax: Math.max(this.vertices[i].y, this.vertices[iNext].y),
        slope: (rightVertex.y - leftVertex.y) / (rightVertex.x - leftVertex.x),
      };

      const yMin = Math.min(this.vertices[i].y, this.vertices[iNext].y);
      if (!this.edgeTable[yMin]) this.edgeTable[yMin] = [];
      this.edgeTable[yMin].push(edgeData);
    }
  }
}

export class Point3D {
  x: number;
  y: number;
  z: number;

  constructor(vertices: string[] | number[]) {
    if (typeof vertices[1] === 'string') {
      this.x = parseFloat(vertices[1] as string);
      this.y = parseFloat(vertices[2] as string);
      this.z = parseFloat(vertices[3] as string);
    } else {
      this.x = vertices[1] as number;
      this.y = vertices[2] as number;
      this.z = vertices[3] as number;
    }
  }
}

export class Vertex extends Point3D {
  vector: Vector;

  constructor(vertices: string[], vector: string[]) {
    super(vertices.map((v) => Math.round(parseFloat(v) * scale + scale)));
    this.vector = new Vector(vector);
  }
}

export class Vector extends Point3D {}

export interface EdgeData {
  yMax: number;
  xMin: number;
  slope: number;
}

export interface ActiveEdgeData {
  edgeData: EdgeData;
  x: number;
}
