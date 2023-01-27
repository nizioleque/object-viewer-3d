import { EdgeData, ActiveEdgeData, FillMode, Face } from '../types';
import getColorGouraud from './getColorGouraud';
import getColorPhong from './getColorPhong';

export default function fillPolygon(
  face: Face,
  imageData: ImageData,
  zBuffer: number[][],
  canvasScale: number,
  fillMode: FillMode
) {
  const edgeTable: EdgeData[][] = [];

  for (let i = 0; i < face.vertices.length; i++) {
    const iNext = (i + 1) % face.vertices.length;

    const leftVertex =
      face.vertices[i].screen!.x > face.vertices[iNext].screen!.x
        ? face.vertices[iNext]
        : face.vertices[i];
    const rightVertex =
      face.vertices[i] === leftVertex ? face.vertices[iNext] : face.vertices[i];

    if (leftVertex.screen!.y === rightVertex.screen!.y) {
      continue;
    }

    const yMinVertex =
      face.vertices[i].screen!.y < face.vertices[iNext].screen!.y
        ? face.vertices[i]
        : face.vertices[iNext];

    const edgeData: EdgeData = {
      xofYMin: yMinVertex.screen!.x,
      yMax: Math.max(
        face.vertices[i].screen!.y,
        face.vertices[iNext].screen!.y
      ),
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
          (face.vertices[1].screen!.y - face.vertices[2].screen!.y) *
            (face.vertices[0].screen!.x - face.vertices[2].screen!.x) +
          (face.vertices[2].screen!.x - face.vertices[1].screen!.x) *
            (face.vertices[0].screen!.y - face.vertices[2].screen!.y);

        const a1 = face.vertices[1].screen!.y - face.vertices[2].screen!.y;
        const a2 = face.vertices[2].screen!.x - face.vertices[1].screen!.x;
        const b1 = face.vertices[2].screen!.y - face.vertices[0].screen!.y;
        const b2 = face.vertices[0].screen!.x - face.vertices[2].screen!.x;

        const alpha =
          (a1 * (x - face.vertices[2].screen!.x) +
            a2 * (y - face.vertices[2].screen!.y)) /
          det;

        const beta =
          (b1 * (x - face.vertices[2].screen!.x) +
            b2 * (y - face.vertices[2].screen!.y)) /
          det;

        const gamma = 1 - alpha - beta;

        const pointZ =
          face.vertices[0].screen!.z * alpha +
          face.vertices[1].screen!.z * beta +
          face.vertices[2].screen!.z * gamma;

        if (pointZ > zBuffer[x][y]) continue;
        zBuffer[x][y] = pointZ;

        let pixelColor: number[];
        switch (fillMode) {
          case FillMode.Uniform:
            pixelColor = face.vertices[0].color!;
            break;
          case FillMode.Gouraud:
            pixelColor = getColorGouraud(face, alpha, beta, gamma);
            break;
          case FillMode.Phong:
            pixelColor = getColorPhong(face, x, y);
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
