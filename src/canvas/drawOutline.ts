import { Face, ObjectData } from '../types';

export function drawOutlines(
  objectData: ObjectData,
  ctx: CanvasRenderingContext2D
): void {
  objectData.faces.forEach((face) => drawFaceOutline(face, ctx));
}

export function drawFaceOutline(
  face: Face,
  ctx: CanvasRenderingContext2D
): void {
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  for (let i = 0; i < face.vertices.length; i++) {
    if (i === 0) {
      ctx.moveTo(face.vertices[i].x, face.vertices[i].y);
    } else {
      ctx.lineTo(face.vertices[i].x, face.vertices[i].y);
    }
  }
  ctx.stroke();
}
