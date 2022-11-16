import { Params } from '../hooks/useParams';
import { StyleOptions } from '../hooks/useStyleOptions';
import { CalculationMode, DrawArgs, ObjectData, Point3D } from '../types';
import { drawOutlines } from './drawOutline';
import { calculateColor } from './fillColor';
import { fillPolygon as fillPolygon } from './fillPolygon';

export function fill(
  {
    objectData,
    lightPosition,
    params,
    drawOutline,
    calculationMode,
    styleOptions,
    size,
  }: DrawArgs,
  ctx: CanvasRenderingContext2D,
  texture: number[] | undefined,
  normalMap: number[] | null
): number {
  if (!ctx) return NaN;

  const t0 = performance.now();

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  if (canvasHeight === 0 || canvasWidth === 0) return 0;
  const imageData = ctx.createImageData(canvasWidth, canvasHeight);

  if (calculationMode === CalculationMode.InterpolateColor) {
    calculateVertexColors(
      objectData,
      lightPosition,
      params,
      styleOptions,
      texture,
      size
    );
  }

  for (const face of objectData.faces) {
    fillPolygon(
      face,
      imageData.data,
      canvasWidth,
      canvasHeight,
      calculationMode,
      lightPosition,
      params,
      styleOptions,
      texture,
      size
    );
  }

  // ctx.clearRect(0, 0, 1000, 1000);
  ctx.putImageData(imageData, 0, 0);

  if (drawOutline) drawOutlines(objectData, ctx);

  const t1 = performance.now();
  return t1 - t0;
}

function calculateVertexColors(
  objectData: ObjectData,
  lightPosition: Point3D,
  params: Params,
  styleOptions: StyleOptions,
  texture: number[] | undefined,
  size: number
) {
  for (const rowIndex in objectData.vertices) {
    const row = objectData.vertices[parseInt(rowIndex)];
    for (const vertexIndex in row) {
      const vertex = row[parseInt(vertexIndex)];
      vertex.color = calculateColor(
        vertex,
        lightPosition,
        params,
        styleOptions,
        texture,
        size
      );
    }
  }

  return objectData.vertices;
}
