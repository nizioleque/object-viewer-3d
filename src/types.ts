export interface ObjectData {
  vertices: Vertex[][];
  faces: Face[];
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

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Vertex extends Point3D {
  vector: Point3D;
  color: [number, number, number, number];
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
