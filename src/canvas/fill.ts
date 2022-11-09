import { Params } from '../hooks/useParams';
import { CalculationMode, ObjectData, Point3D } from '../types';
import { drawOutlines } from './drawOutline';
import { calculateColor } from './fillColor';
import { fillPolygon as fillPolygon } from './fillPolygon';

export function fill(
  objectData: ObjectData,
  lightPosition: Point3D,
  params: Params,
  drawOutline: boolean,
  calculationMode: CalculationMode,
  ctx: CanvasRenderingContext2D
): number {
  if (!ctx) return NaN;

  const t0 = performance.now();

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  if (canvasHeight === 0 || canvasWidth === 0) return 0;
  const imageData = ctx.createImageData(canvasWidth, canvasHeight);

  if (calculationMode === CalculationMode.InterpolateColor) {
    calculateVertexColors(objectData, lightPosition, params);
  }

  for (const face of objectData.faces) {
    fillPolygon(
      face,
      imageData.data,
      canvasWidth,
      canvasHeight,
      calculationMode,
      lightPosition,
      params
    );
  }

  ctx.putImageData(imageData, 0, 0);

  if (drawOutline) drawOutlines(objectData, ctx);

  const t1 = performance.now();
  return t1 - t0;
}

function calculateVertexColors(
  objectData: ObjectData,
  lightPosition: Point3D,
  params: Params
) {
  for (const rowIndex in objectData.vertices) {
    const row = objectData.vertices[parseInt(rowIndex)];
    for (const vertexIndex in row) {
      const vertex = row[parseInt(vertexIndex)];
      vertex.color = calculateColor(vertex, lightPosition, params);
    }
  }

  return objectData.vertices;
}