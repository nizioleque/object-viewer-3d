export class ObjectData {
  faces: Face[];

  constructor(faces: Face[]) {
    this.faces = faces;
  }
}

export class Face {
  vertices: Vertex[];

  constructor(vertices: Vertex[]) {
    this.vertices = vertices;
  }
}

export class Point3D {
  x: number;
  y: number;
  z: number;

  constructor(vertices: string[]) {
    this.x = parseFloat(vertices[1]);
    this.y = parseFloat(vertices[2]);
    this.z = parseFloat(vertices[3]);
  }
}

export class Vertex extends Point3D {
  vector: Vector;

  constructor(vertices: string[], vector: string[]) {
    super(vertices);
    this.vector = new Vector(vector);
  }
}

export class Vector extends Point3D {}
