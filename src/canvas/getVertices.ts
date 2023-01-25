import { matrix, multiply } from 'mathjs';
import { viewMatrixUp } from '../const';
import { Vertex } from '../types';

export default function getVertices(
  face: Vertex[],
  rotationMatrix: math.Matrix,
  translationMatrix: math.Matrix,
  projectionMatrix: math.Matrix,
  canvasScale: number
) {
  const vertices = [];
  for (const v of face) {
    const vector = matrix([[v.x], [v.y], [v.z], [1]]);
    const multRot = multiply(rotationMatrix, vector);
    const multTrans = multiply(translationMatrix, multRot);
    const multLook = multiply(viewMatrixUp, multTrans);
    const multProj = multiply(projectionMatrix, multLook);
    const scale = multProj.get([3, 0]);
    const x = multProj.get([0, 0]) / scale;
    const y = multProj.get([1, 0]) / scale;
    const z = multProj.get([2, 0]) / scale;
    if (x > -1 && x < 1 && y > -1 && y < 1 && z > -1 && z < 1) {
      vertices.push({
        x: (x * canvasScale + canvasScale) << 0,
        y: (y * canvasScale + canvasScale) << 0,
        z: (z * canvasScale + canvasScale) << 0,
      });
    }
  }

  return vertices;
}
