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

  constructor(vertices: Vertex[], index: number) {
    this.vertices = vertices;
    this.createEdgeTable(index === 401);
  }

  createEdgeTable(log: boolean) {
    this.edgeTable = [];

    for (let i = 0; i < this.vertices.length; i++) {
      const iNext = (i + 1) % this.vertices.length;

      log && console.log(this.vertices[i]);

      const leftVertex =
        this.vertices[i].x > this.vertices[iNext].x
          ? this.vertices[iNext]
          : this.vertices[i];
      const rightVertex =
        this.vertices[i] === leftVertex
          ? this.vertices[iNext]
          : this.vertices[i];

      if (leftVertex.y === rightVertex.y) {
        log && console.log('left equals right');
        continue;
      }

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

      log && console.log(edgeData);

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
  xofYMin: number;
  slopeInverted: number;
}

export interface ActiveEdgeData {
  edgeData: EdgeData;
  x: number;
}
