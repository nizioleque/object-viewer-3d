import { ObjectData, Point3D, Vertex } from '../types';
import { fillPolygon } from './fillPolygon';

export function fill(
  objectData: ObjectData,
  ctx: CanvasRenderingContext2D
): number {
  const t0 = performance.now();

  calculateVertexColors(objectData);

  // console.log(objectData);
  // return 0;

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  if (canvasHeight === 0 || canvasWidth === 0) return 0;
  const imageData = ctx.createImageData(canvasWidth, canvasHeight);
  objectData.faces.forEach((face) =>
    fillPolygon(face, imageData.data, canvasWidth, canvasHeight)
  );
  // fillPolygon(objectData.faces[403], imageData.data, canvasWidth, canvasHeight);
  ctx.putImageData(imageData, 0, 0);

  const t1 = performance.now();

  return t1 - t0;
}

function calculateVertexColors(objectData: ObjectData) {
  for (const row of objectData.vertices) {
    // const row = objectData.vertices[parseInt(rowIndex)];
    if (!row) continue;
    for (const vertex of row) {
      // const vertex = row[parseInt(vertexIndex)];
      if (!vertex) continue;
      calculateColor(vertex);
    }
  }
}

const V: Point3D = { x: 0, y: 0, z: 1 };
const IL = [1, 1, 1];
const IO = [1, 0.2, 0.2];

const kd = 0.5;
const ks = 0.5;
const m = 10;

function calculateColor(vertex: Vertex) {
  // const cosNL = ;
  // const cosVR = ;

  // const I1;
  // const I2;

  vertex.color = [
    (Math.random() * 255) << 0,
    (Math.random() * 255) << 0,
    (Math.random() * 255) << 0,
    255,
  ];

  // console.log('a');
}

function prod(p1: Point3D, p2: Point3D) {
  return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
}
