import { DrawArgs3D, ObjectData3D } from '../types';
import fillPolygon from './fillPolygon';
import getFaceScreenCoords from './getFaceScreenCoords';
import {
  getProjectionMatrix,
  getRotationMatrix,
  getTranslationMatrix,
} from './matrices';

export async function paint(
  drawArgs3D: DrawArgs3D,
  ctx: CanvasRenderingContext2D,
  objectData3D: ObjectData3D[]
) {
  const canvasSize = 1000 * drawArgs3D.scale;
  const canvasScale = canvasSize / 2;

  if (ctx.canvas.height !== canvasSize) {
    ctx.canvas.width = canvasSize;
    ctx.canvas.height = canvasSize;
  }

  if (!ctx) {
    console.error('no canvas context');
    return;
  }

  // fill
  const imageData = ctx.createImageData(canvasSize, canvasSize);
  const projectionMatrix = getProjectionMatrix(drawArgs3D.fov);
  const zBuffer: number[][] = [...Array(canvasSize)].map((e) =>
    Array(canvasSize).fill(Infinity)
  );

  for (const objectIndex in objectData3D) {
    const object = objectData3D[objectIndex];
    const rotationMatrix = getRotationMatrix(
      drawArgs3D.objectPosition[objectIndex]
    );
    const translationMatrix = getTranslationMatrix(
      drawArgs3D.objectPosition[objectIndex]
    );

    for (const face of object.faces) {
      const drawFace = getFaceScreenCoords(
        face,
        rotationMatrix,
        translationMatrix,
        projectionMatrix,
        canvasScale
      );

      if (drawFace) {
        fillPolygon(
          face,
          imageData,
          object.color,
          zBuffer,
          canvasScale,
          drawArgs3D.fillMode
        );
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
