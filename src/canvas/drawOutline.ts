import { Face, ObjectData } from '../types';

export function drawOutlines(
  objectData: ObjectData,
  ctx: CanvasRenderingContext2D
): void {
  objectData.faces.forEach((face, index) => drawFaceOutline(face, ctx, index));
}

export function drawFaceOutline(
  face: Face,
  ctx: CanvasRenderingContext2D,
  index: number
): void {
  ctx.beginPath();
  ctx.lineWidth = 1;
  //   if (index === 401) ctx.strokeStyle = 'red';
  //   else ctx.strokeStyle = 'black';
  ctx.strokeStyle = 'red';
  ctx.moveTo(face.vertices[0].x + 0.5, face.vertices[0].y + 0.5);
  for (let i = 1; i < face.vertices.length; i++) {
    ctx.lineTo(face.vertices[i].x + 0.5, face.vertices[i].y + 0.5);
  }
  ctx.lineTo(face.vertices[0].x + 0.5, face.vertices[0].y + 0.5);
  ctx.stroke();
}
