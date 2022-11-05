export class ObjectData {
  faces: Face[];

  constructor(faces: Face[]) {
    this.faces = faces;
  }

  drawOutline(ctx: CanvasRenderingContext2D, scale: number): void {
    this.faces.forEach((face) => face.drawOutline(ctx, scale));
  }
}

export class Face {
  vertices: Vertex[];

  constructor(vertices: Vertex[]) {
    this.vertices = vertices;
  }

  drawOutline(ctx: CanvasRenderingContext2D, scale: number): void {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    for (let i = 0; i < this.vertices.length; i++) {
      if (i === 0) {
        ctx.moveTo(
          this.vertices[i].x * scale + scale,
          this.vertices[i].y * scale + scale
        );
      } else {
        ctx.lineTo(
          this.vertices[i].x * scale + scale,
          this.vertices[i].y * scale + scale
        );
      }
    }
    ctx.stroke();
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
