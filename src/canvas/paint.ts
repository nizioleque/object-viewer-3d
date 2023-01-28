import { CameraMode, DrawArgs3D, FillMode, ObjectData3D } from '../types';
import calculateVertexColor from './calculateVertexColor';
import fillPolygon from './fillPolygon';
import getFaceScreenCoords from './getFaceScreenCoords';
import getInterpolatedVertex from './getInterpolatedVertex';
import {
  getProjectionMatrix,
  getRotationMatrix,
  getTranslationMatrix,
  viewMatrixFollowing,
  viewMatrixMoving,
  viewMatrixUp,
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
  ctx.fillStyle = `rgb(${drawArgs3D.daylight[0]},${drawArgs3D.daylight[1]},${drawArgs3D.daylight[2]})`;
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const projectionMatrix = getProjectionMatrix(drawArgs3D.fov);
  const zBuffer: number[][] = [...Array(canvasSize)].map((e) =>
    Array(canvasSize).fill(Infinity)
  );

  let viewMatrix = viewMatrixUp;
  if (drawArgs3D.cameraMode === CameraMode.Following) {
    viewMatrix = viewMatrixFollowing(drawArgs3D.objectPosition[2].offset);
  } else if (drawArgs3D.cameraMode === CameraMode.Moving) {
    viewMatrix = viewMatrixMoving(
      drawArgs3D.objectPosition[2].offset,
      drawArgs3D.objectPosition[2].rotation
    );
  }

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
        viewMatrix,
        canvasScale
      );

      if (drawFace) {
        if (drawArgs3D.fillMode === FillMode.Uniform) {
          const interpolatedVertex = getInterpolatedVertex(face.vertices);
          face.vertices[0].color = calculateVertexColor(
            interpolatedVertex,
            object.color,
            drawArgs3D.lightSources
          );
        } else if (drawArgs3D.fillMode === FillMode.Gouraud) {
          face.vertices[0].color = calculateVertexColor(
            face.vertices[0],
            object.color,
            drawArgs3D.lightSources
          );
          face.vertices[1].color = calculateVertexColor(
            face.vertices[1],
            object.color,
            drawArgs3D.lightSources
          );
          face.vertices[2].color = calculateVertexColor(
            face.vertices[2],
            object.color,
            drawArgs3D.lightSources
          );
        }

        fillPolygon(
          face,
          object.color,
          imageData,
          zBuffer,
          canvasScale,
          drawArgs3D.fillMode,
          drawArgs3D.lightSources
        );
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
