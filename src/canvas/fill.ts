import { ActiveEdgeData, EdgeData, Face, ObjectData } from '../types';

export function fill(
  objectData: ObjectData,
  ctx: CanvasRenderingContext2D
): void {
  ctx.fillStyle = 'black';

  objectData.faces.forEach((face) => fillPolygon(face, ctx));
  //   fillPolygon(objectData.faces[300], ctx);
}

export function fillPolygon(face: Face, ctx: CanvasRenderingContext2D) {
  let activeEdgeTable: ActiveEdgeData[] = [];

  const tempEdgeTable: EdgeData[][] = [];
  for (const edgeTableRow in face.edgeTable) {
    tempEdgeTable[edgeTableRow] = [...face.edgeTable[edgeTableRow]];
  }

  //   console.log(face);

  let y = Math.min(...Object.keys(tempEdgeTable).map((key) => parseInt(key)));

  do {
    // move from ET to AET
    if (tempEdgeTable[y]) {
      tempEdgeTable[y].forEach((e) => {
        // if (Math.abs(e.slope) > 0.01) {
        activeEdgeTable.push({ edgeData: e, x: e.xMin });
        // }
      });
    }

    // sort AET
    activeEdgeTable.sort((a, b) => a.x - b.x);

    // fill pixels
    fillLine();

    // remove from AET
    // const len = activeEdgeTable.length;
    activeEdgeTable = activeEdgeTable.filter((e) => e.edgeData.yMax > y);
    // console.log('before', len, 'after', activeEdgeTable.length);

    // move to next scan line
    y++;

    // update x in AET
    activeEdgeTable.forEach((e) => (e.x += 1 / e.edgeData.slope));
  } while (activeEdgeTable.length > 0 && tempEdgeTable.length > 0);

  function fillLine() {
    if (activeEdgeTable.length % 2 !== 0) {
      //   console.error('number of active edges is not even!');
      return;
    }

    for (let i = 0; i < activeEdgeTable.length; i += 2) {
      const startX = activeEdgeTable[i].x;
      const endX = activeEdgeTable[i + 1].x;
      //   console.log(startX, endX);
      for (let x = startX; x <= endX; x++) {
        ctx.fillRect(x, y, 1, 1);
        // console.log('filling pixel', x, y);
      }
    }
  }
}
