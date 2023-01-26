import { EdgeData, ActiveEdgeData, Vertex, FillMode } from '../types';
import getColorGouraud from './getColorGouraud';
import getColorPhong from './getColorPhong';
import getColorUniform from './getColorUniform';

export default function fillPolygon(
  face: Vertex[],
  imageData: ImageData,
  color: number[],
  zBuffer: number[][],
  canvasScale: number,
  fillMode: FillMode
) {
  const edgeTable: EdgeData[][] = [];

  for (let i = 0; i < face.length; i++) {
    const iNext = (i + 1) % face.length;

    const leftVertex =
      face[i].screen!.x > face[iNext].screen!.x ? face[iNext] : face[i];
    const rightVertex = face[i] === leftVertex ? face[iNext] : face[i];

    if (leftVertex.screen!.y === rightVertex.screen!.y) {
      continue;
    }

    const yMinVertex =
      face[i].screen!.y < face[iNext].screen!.y ? face[i] : face[iNext];

    const edgeData: EdgeData = {
      xofYMin: yMinVertex.screen!.x,
      yMax: Math.max(face[i].screen!.y, face[iNext].screen!.y),
      slopeInverted:
        (rightVertex.screen!.x - leftVertex.screen!.x) /
        (rightVertex.screen!.y - leftVertex.screen!.y),
    };

    const yMin = yMinVertex.screen!.y;
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
          (face[1].screen!.y - face[2].screen!.y) *
            (face[0].screen!.x - face[2].screen!.x) +
          (face[2].screen!.x - face[1].screen!.x) *
            (face[0].screen!.y - face[2].screen!.y);

        const a1 = face[1].screen!.y - face[2].screen!.y;
        const a2 = face[2].screen!.x - face[1].screen!.x;
        const b1 = face[2].screen!.y - face[0].screen!.y;
        const b2 = face[0].screen!.x - face[2].screen!.x;

        const alpha =
          (a1 * (x - face[2].screen!.x) + a2 * (y - face[2].screen!.y)) / det;

        const beta =
          (b1 * (x - face[2].screen!.x) + b2 * (y - face[2].screen!.y)) / det;

        const gamma = 1 - alpha - beta;

        const pointZ =
          face[0].screen!.z * alpha +
          face[1].screen!.z * beta +
          face[2].screen!.z * gamma;

        if (pointZ > zBuffer[x][y]) continue;
        zBuffer[x][y] = pointZ;

        let pixelColor: number[];
        switch (fillMode) {
          case FillMode.Uniform:
            pixelColor = getColorUniform(face, color);
            break;
          case FillMode.Gouraud:
            pixelColor = getColorGouraud(face, color);
            break;
          case FillMode.Phong:
            pixelColor = getColorPhong(face, color);
            break;
        }

        const offset = (y * canvasScale * 2 + x) * 4;
        imageData.data.set(pixelColor!, offset);
      }
    }

    // move to next scan line
    y++;

    // update x in AET
    activeEdgeTable.forEach((e) => (e.x += e.edgeData.slopeInverted));
  } while (activeEdgeTable.length > 0 && tempEdgeTable.length > 0);
}
