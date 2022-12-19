import * as math from 'mathjs';
import { MutableRefObject, useContext } from 'react';
import { AppContext } from '../AppContext';
import { FillWorker } from '../workers/fillWorker';
import { viewMatrix, ObjectData3D } from './useObject3D';

const canvasScale = 500;

export default function useDraw3D(
  _offscreenCanvas: MutableRefObject<HTMLCanvasElement | undefined>,
  _worker: MutableRefObject<FillWorker | undefined>,
  canvasCtx: MutableRefObject<CanvasRenderingContext2D | undefined>
) {
  const { objectData3D, fov } = useContext(AppContext);

  const getVertices = (
    object: ObjectData3D,
    face: number[],
    modelMatrix: math.Matrix,
    projectionMatrix: math.Matrix
  ) => {
    const vertices = [];
    for (let i = 1; i < face.length; i++) {
      const v = object.vertices[face[i] - 1];
      const vector = math.matrix([[v.x], [v.y], [v.z], [1]]);
      const multModel = math.multiply(modelMatrix, vector);
      const multLook = math.multiply(viewMatrix, multModel);
      const multProj = math.multiply(projectionMatrix, multLook);
      const scale = multProj.get([3, 0]);
      const x = multProj.get([0, 0]) / scale;
      const y = multProj.get([1, 0]) / scale;
      if (x > -1 && x < 1 && y > -1 && y < 1) {
        vertices.push({
          x: x * canvasScale + canvasScale,
          y: y * canvasScale + canvasScale,
        });
      }
    }

    return vertices;
  };

  const draw3D = () => {
    const projectionMatrix = getProjectionMatrix(fov);
    if (!canvasCtx.current) {
      console.error('no canvas context');
      return;
    }
    canvasCtx.current.clearRect(0, 0, 1000, 1000);
    for (const object of objectData3D) {
      const modelMatrix = object.modelMatrixFn(Date.now() / 2000);
      for (const face of object.faces) {
        const vertices = getVertices(
          object,
          face,
          modelMatrix,
          projectionMatrix
        );
        if (vertices.length < 3) continue;

        canvasCtx.current.beginPath();
        canvasCtx.current.lineWidth = 1;
        canvasCtx.current.strokeStyle = 'violet';
        canvasCtx.current.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
          canvasCtx.current.lineTo(vertices[i].x, vertices[i].y);
        }
        canvasCtx.current.lineTo(vertices[0].x, vertices[0].y);
        canvasCtx.current.stroke();
      }
    }
  };

  const getProjectionMatrix = (fov: number) => {
    const fovRad = fov * 0.01745329252;
    const e = 1 / Math.tan(fovRad / 2);
    const a = 1; // aspect ratio
    const n = 0.5; //near
    const f = 3.5; //far

    return math.matrix([
      [e, 0, 0, 0],
      [0, e / a, 0, 0],
      [0, 0, -(f + n) / (f - n), (-2 * f * n) / (f - n)],
      [0, 0, -1, 0],
    ]);
  };

  return { draw3D };
}
