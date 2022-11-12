import { scale } from '../constants';
import { Params } from '../hooks/useParams';
import { StyleOptions } from '../hooks/useStyleOptions';
import {
  Face,
  ActiveEdgeData,
  EdgeData,
  CalculationMode,
  Point3D,
  Vertex,
} from '../types';
import { calculateColor } from './fillColor';

export function fillPolygon(
  face: Face,
  pixels: Uint8ClampedArray,
  canvasWidth: number,
  canvasHeight: number,
  mode: CalculationMode,
  lightPosition: Point3D,
  params: Params,
  styleOptions: StyleOptions
) {
  let activeEdgeTable: ActiveEdgeData[] = [];

  const tempEdgeTable: EdgeData[][] = [];
  for (const edgeTableRow in face.edgeTable) {
    tempEdgeTable[edgeTableRow] = [...face.edgeTable[edgeTableRow]];
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
    if (y > canvasHeight - 1) return;

    if (activeEdgeTable.length % 2 !== 0) return;

    for (let i = 0; i < activeEdgeTable.length; i += 2) {
      const startX = activeEdgeTable[i].x << 0;
      const endX = activeEdgeTable[i + 1].x << 0;
      for (let x = startX; x <= endX; x++) {
        if (x > canvasWidth - 1) continue;
        const offset = (y * canvasWidth + x) * 4;
        let pixelColor: number[];
        if (mode === CalculationMode.InterpolateColor) {
          pixelColor = getPixelColorColorMode(x, y);
        } else if (mode === CalculationMode.InterpolateVector) {
          pixelColor = getPixelColorVectorMode(x, y);
        }
        pixels.set(pixelColor!, offset);
      }
    }

    // move to next scan line
    y++;

    // update x in AET
    activeEdgeTable.forEach((e) => (e.x += e.edgeData.slopeInverted));
  } while (activeEdgeTable.length > 0 && tempEdgeTable.length > 0);

  function getPixelColorColorMode(x: number, y: number) {
    return getPixelColor(face, x, y);
  }

  function getPixelColorVectorMode(x: number, y: number) {
    const interpolatedVector = getPixelVector(face, x, y);
    return calculateColor(
      {
        original: {
          x: (x - scale) / scale,
          y: (y - scale) / scale,
          z: interpolatedVector.pointZ,
        },
        vector: interpolatedVector.vector,
      } as Vertex,
      lightPosition,
      params,
      styleOptions
    );
  }
}

function getPixelColor(face: Face, x: number, y: number) {
  const alpha =
    (face.a1 * (x - face.vertices[2].x) + face.a2 * (y - face.vertices[2].y)) /
    face.det;

  const beta =
    (face.b1 * (x - face.vertices[2].x) + face.b2 * (y - face.vertices[2].y)) /
    face.det;

  const gamma = 1 - alpha - beta;

  const r =
    (face.vertices[0].color[0] * alpha +
      face.vertices[1].color[0] * beta +
      face.vertices[2].color[0] * gamma) <<
    0;
  const g =
    (face.vertices[0].color[1] * alpha +
      face.vertices[1].color[1] * beta +
      face.vertices[2].color[1] * gamma) <<
    0;
  const b =
    (face.vertices[0].color[2] * alpha +
      face.vertices[1].color[2] * beta +
      face.vertices[2].color[2] * gamma) <<
    0;

  return [r, g, b, 255];
}

function getPixelVector(
  face: Face,
  x: number,
  y: number
): { vector: Point3D; pointZ: number } {
  const alpha =
    (face.a1 * (x - face.vertices[2].x) + face.a2 * (y - face.vertices[2].y)) /
    face.det;

  const beta =
    (face.b1 * (x - face.vertices[2].x) + face.b2 * (y - face.vertices[2].y)) /
    face.det;

  const gamma = 1 - alpha - beta;

  const vectorX =
    face.vertices[0].vector.x * alpha +
    face.vertices[1].vector.x * beta +
    face.vertices[2].vector.x * gamma;
  const vectorY =
    face.vertices[0].vector.y * alpha +
    face.vertices[1].vector.y * beta +
    face.vertices[2].vector.y * gamma;
  const vectorZ =
    face.vertices[0].vector.z * alpha +
    face.vertices[1].vector.z * beta +
    face.vertices[2].vector.z * gamma;

  const pointZ =
    face.vertices[0].original.z * alpha +
    face.vertices[1].original.z * beta +
    face.vertices[2].original.z * gamma;

  return { vector: { x: vectorX, y: vectorY, z: vectorZ }, pointZ };
}
