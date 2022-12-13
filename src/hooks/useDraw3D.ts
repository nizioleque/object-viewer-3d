import * as math from 'mathjs';
import { MutableRefObject, useContext, useRef } from 'react';
import { AppContext } from '../AppContext';
import { lookAtMatrix, ObjectData3D } from './useObject3D';

const canvasScale = 500;

export default function useDraw3D(
  offscreenCanvas: MutableRefObject<HTMLCanvasElement | undefined>,
  canvasCtx: MutableRefObject<CanvasRenderingContext2D | undefined>
) {
  const { objectData3D } = useContext(AppContext);

  const time = useRef<number>(0);

  const getVertices = (
    object: ObjectData3D,
    face: number[],
    modelMatrix: math.Matrix,
    projectionMatrix: math.Matrix
  ) => {
    const vertices = [];
    for (let i = 1; i < face.length; i++) {
      const v = object.vertices[face[i] - 1];
      //   console.log(face, i, v);
      const vector = math.matrix([[v.x], [v.y], [v.z], [1]]);
      const multModel = math.multiply(modelMatrix, vector);
      const multLook = math.multiply(lookAtMatrix, multModel);
      const multProj = math.multiply(projectionMatrix, multLook);
      //   console.log(multProj);
      const scale = multProj.get([3, 0]);
      vertices.push({
        x: (multProj.get([0, 0]) / scale) * canvasScale + canvasScale,
        y: (multProj.get([1, 0]) / scale) * canvasScale + canvasScale,
        // z: (multProj.get([2, 0]) / scale) * 200 + 200,
      });
    }

    return vertices;
  };

  const draw3D = () => {
    console.log('draw3d...');
    const projectionMatrix = getProjectionMatrix();
    if (!canvasCtx.current) {
      console.error('no canvas context');
      return;
    }
    canvasCtx.current.clearRect(0, 0, 1000, 1000);
    // console.log(objectData3D);
    for (const object of objectData3D) {
      //   console.log(object);
      const modelMatrix = object.modelMatrixFn(time.current++);
      for (const face of object.faces) {
        // console.log(face);
        // console.log('drawing face', face);
        const vertices = getVertices(
          object,
          face,
          modelMatrix,
          projectionMatrix
        );

        canvasCtx.current.beginPath();
        canvasCtx.current.lineWidth = 1;
        canvasCtx.current.strokeStyle = 'rgb(255, 0, 255, 0.3)';
        canvasCtx.current.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
          canvasCtx.current.lineTo(vertices[i].x, vertices[i].y);
        }
        canvasCtx.current.lineTo(vertices[0].x, vertices[0].y);
        canvasCtx.current.stroke();
      }
    }
  };

  const getProjectionMatrix = () => {
    const fov = 90 / (2 * Math.PI);
    const e = 1 / Math.tan(fov / 2);
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
