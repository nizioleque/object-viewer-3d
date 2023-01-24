import * as math from 'mathjs';
import { cos, sin } from 'mathjs';
import { viewMatrixUp } from '../const';
import {
  ActiveEdgeData,
  DrawArgs3D,
  EdgeData,
  ObjectData3D,
  ObjectPosition,
  Point3D,
} from '../types';

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

  const getVertices = (
    object: ObjectData3D,
    face: number[],
    rotationMatrix: math.Matrix,
    translationMatrix: math.Matrix,
    projectionMatrix: math.Matrix
  ) => {
    const vertices = [];
    for (let i = 1; i < face.length; i++) {
      const v = object.vertices[face[i] - 1];
      const vector = math.matrix([[v.x], [v.y], [v.z], [1]]);
      const multRot = math.multiply(rotationMatrix, vector);
      const multTrans = math.multiply(translationMatrix, multRot);
      const multLook = math.multiply(viewMatrixUp, multTrans);
      const multProj = math.multiply(projectionMatrix, multLook);
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
  };

  const getProjectionMatrix = (fov: number) => {
    const fovRad = fov * 0.01745329252;
    const e = 1 / Math.tan(fovRad / 2);
    const a = 1; // aspect ratio
    const n = 1; //near
    const f = 10; //far

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

  // fill
  const imageData = ctx.createImageData(canvasSize, canvasSize);

  const zBuffer: number[][] = [...Array(canvasSize)].map((e) =>
    Array(canvasSize).fill(Infinity)
  );

  for (const objectIndex in objectData3D) {
    const object = objectData3D[objectIndex];
    const rotationMatrix = rotationMatrixValue(
      drawArgs3D.objectPosition[objectIndex]
    );
    const translationMatrix = translationMatrixValue(
      drawArgs3D.objectPosition[objectIndex]
    );

    for (const face of object.faces) {
      const vertices: Point3D[] = getVertices(
        object,
        face,
        rotationMatrix,
        translationMatrix,
        projectionMatrix
      );
      if (vertices.length < 3) continue;

      fillPolygon3D(vertices, imageData, object.color, zBuffer, canvasScale);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

const rotationMatrixValue = ({ rotation: r }: ObjectPosition) =>
  math.matrix([
    [
      cos(r.z) * cos(r.y),
      cos(r.z) * sin(r.y) * sin(r.x) - sin(r.z) * cos(r.x),
      cos(r.z) * sin(r.y) * cos(r.x) + sin(r.z) * sin(r.x),
      0,
    ],
    [
      sin(r.z) * cos(r.y),
      sin(r.z) * sin(r.y) * sin(r.x) + cos(r.z) * cos(r.x),
      sin(r.z) * sin(r.y) * cos(r.x) - cos(r.z) * sin(r.x),
      0,
    ],
    [-sin(r.y), cos(r.y) * sin(r.x), cos(r.y) * cos(r.x), 0],
    [0, 0, 0, 1],
  ]);

const translationMatrixValue = ({ offset: o }: ObjectPosition) =>
  math.matrix([
    [1, 0, 0, o.x],
    [0, 1, 0, o.y],
    [0, 0, 1, o.z],
    [0, 0, 0, 1],
  ]);

function fillPolygon3D(
  vertices: Point3D[],
  imageData: ImageData,
  color: number[],
  zBuffer: number[][],
  canvasScale: number
) {
  const edgeTable: EdgeData[][] = [];

  for (let i = 0; i < vertices.length; i++) {
    const iNext = (i + 1) % vertices.length;

    const leftVertex =
      vertices[i].x > vertices[iNext].x ? vertices[iNext] : vertices[i];
    const rightVertex =
      vertices[i] === leftVertex ? vertices[iNext] : vertices[i];

    if (leftVertex.y === rightVertex.y) {
      continue;
    }

    const yMinVertex =
      vertices[i].y < vertices[iNext].y ? vertices[i] : vertices[iNext];

    const edgeData: EdgeData = {
      xofYMin: yMinVertex.x,
      yMax: Math.max(vertices[i].y, vertices[iNext].y),
      slopeInverted:
        (rightVertex.x - leftVertex.x) / (rightVertex.y - leftVertex.y),
    };

    const yMin = yMinVertex.y;
    if (!edgeTable[yMin]) edgeTable[yMin] = [];

    edgeTable[yMin].push(edgeData);
  }

  let activeEdgeTable: ActiveEdgeData[] = [];

  const tempEdgeTable: EdgeData[][] = [];
  for (const edgeTableRow in edgeTable) {
    tempEdgeTable[edgeTableRow] = [...edgeTable[edgeTableRow]];
  }

  let y = Math.min(...Object.keys(tempEdgeTable).map((key) => parseInt(key)));

  do {
    // move from ET to AET
    if (tempEdgeTable[y]) {
      tempEdgeTable[y].forEach((e) => {
        activeEdgeTable.push({ edgeData: e, x: e.xofYMin });
      });
    }

    // remove from AET
    activeEdgeTable = activeEdgeTable.filter((e) => y < e.edgeData.yMax);

    // sort AET
    activeEdgeTable.sort((a, b) => a.x - b.x);

    // fill pixels
    if (y > canvasScale * 2 - 1) return;

    if (activeEdgeTable.length % 2 !== 0) return;

    for (let i = 0; i < activeEdgeTable.length; i += 2) {
      const startX = activeEdgeTable[i].x << 0;
      const endX = activeEdgeTable[i + 1].x << 0;
      for (let x = startX; x <= endX; x++) {
        if (x > canvasScale * 2 - 1) continue;

        const det =
          (vertices[1].y - vertices[2].y) * (vertices[0].x - vertices[2].x) +
          (vertices[2].x - vertices[1].x) * (vertices[0].y - vertices[2].y);

        const a1 = vertices[1].y - vertices[2].y;
        const a2 = vertices[2].x - vertices[1].x;
        const b1 = vertices[2].y - vertices[0].y;
        const b2 = vertices[0].x - vertices[2].x;

        const alpha =
          (a1 * (x - vertices[2].x) + a2 * (y - vertices[2].y)) / det;

        const beta =
          (b1 * (x - vertices[2].x) + b2 * (y - vertices[2].y)) / det;

        const gamma = 1 - alpha - beta;

        const pointZ =
          vertices[0].z * alpha + vertices[1].z * beta + vertices[2].z * gamma;

        if (pointZ > zBuffer[x][y]) continue;
        zBuffer[x][y] = pointZ;

        const offset = (y * canvasScale * 2 + x) * 4;
        let pixelColor: number[];
        pixelColor = [...color, 255];
        imageData.data.set(pixelColor!, offset);
      }
    }

    // move to next scan line
    y++;

    // update x in AET
    activeEdgeTable.forEach((e) => (e.x += e.edgeData.slopeInverted));
  } while (activeEdgeTable.length > 0 && tempEdgeTable.length > 0);
}
