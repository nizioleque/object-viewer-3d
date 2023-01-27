import { inv, matrix, multiply, transpose } from 'mathjs';
import { viewMatrixUp } from '../const';
import { Face } from '../types';

export default function getFaceScreenCoords(
  face: Face,
  rotationMatrix: math.Matrix,
  translationMatrix: math.Matrix,
  projectionMatrix: math.Matrix,
  canvasScale: number
): boolean {
  for (const vertex of face.vertices) {
    const vector = matrix([[vertex.x], [vertex.y], [vertex.z], [1]]);
    const multRot = multiply(rotationMatrix, vector);
    const multTrans = multiply(translationMatrix, multRot);
    const multLook = multiply(viewMatrixUp, multTrans);
    const multProj = multiply(projectionMatrix, multLook);
    const scale = multProj.get([3, 0]);
    const x = multProj.get([0, 0]) / scale;
    const y = multProj.get([1, 0]) / scale;
    const z = multProj.get([2, 0]) / scale;

    if (x < -1 || x > 1 || y < -1 || y > 1 || z < -1 || z > 1) {
      return false;
    }

    const normalVectorMatrix = matrix([
      [vertex.vector.x],
      [vertex.vector.y],
      [vertex.vector.z],
      [1],
    ]);
    const normalVectorRotated = multiply(
      transpose(inv(rotationMatrix)),
      normalVectorMatrix
    );

    const vectorScale = normalVectorRotated.get([3, 0]);
    vertex.vectorSpace = {
      x: normalVectorRotated.get([0, 0]) / vectorScale,
      y: normalVectorRotated.get([1, 0]) / vectorScale,
      z: normalVectorRotated.get([2, 0]) / vectorScale,
    };

    vertex.space = {
      x: multTrans.get([0, 0]),
      y: multTrans.get([1, 0]),
      z: multTrans.get([2, 0]),
    };

    vertex.screen = {
      x: (x * canvasScale + canvasScale) << 0,
      y: (y * canvasScale + canvasScale) << 0,
      z: (z * canvasScale + canvasScale) << 0,
    };
  }

  return true;
}
