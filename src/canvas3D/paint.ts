import * as math from 'mathjs';
import { ObjectData3D } from '../hooks/useObject3D';
import { DrawArgs3D } from '../types';

const canvasScale = 500;

export const viewMatrix: math.Matrix = math.matrix([
  [-0.986, 0.164, 4e-18, -1e-16],
  [-0.027, -0.16, 0.987, 1e-16],
  [0.162, 0.973, 0.162, -3.082],
  [0, 0, 0, 1],
]);

export async function paint(
  drawArgs3D: DrawArgs3D,
  ctx: CanvasRenderingContext2D,
  objectData3D: ObjectData3D[]
) {
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

  const projectionMatrix = getProjectionMatrix(drawArgs3D.fov);
  if (!ctx) {
    console.error('no canvas context');
    return;
  }
  ctx.clearRect(0, 0, 1000, 1000);
  for (const object of objectData3D) {
    const modelMatrix = modelMatrixValue(
      object.rotationModifier,
      Date.now() / 2000
    );
    for (const face of object.faces) {
      const vertices = getVertices(object, face, modelMatrix, projectionMatrix);
      if (vertices.length < 3) continue;

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'violet';
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.lineTo(vertices[0].x, vertices[0].y);
      ctx.stroke();
    }
  }
}

const modelMatrixValue = (rotationModifier: number, t: number) =>
  math.matrix([
    [1, 0, 0, 0],
    [0, Math.cos(t * rotationModifier), -Math.sin(t * rotationModifier), 0],
    [0, Math.sin(t * rotationModifier), Math.cos(t * rotationModifier), 0],
    [0, 0, 0, 1],
  ]);
