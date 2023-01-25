import { Point3D, EdgeData, ActiveEdgeData } from '../types';

export default function fillPolygon(
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
