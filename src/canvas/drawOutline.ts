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
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.15)';
  ctx.moveTo(face.vertices[0].x + 0.5, face.vertices[0].y + 0.5);
  for (let i = 1; i < face.vertices.length; i++) {
    ctx.lineTo(face.vertices[i].x + 0.5, face.vertices[i].y + 0.5);
  }
  ctx.lineTo(face.vertices[0].x + 0.5, face.vertices[0].y + 0.5);
  ctx.stroke();
}
