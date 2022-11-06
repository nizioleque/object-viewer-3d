import { ActiveEdgeData, EdgeData, Face, ObjectData } from '../types';

export function fill(
  objectData: ObjectData,
  ctx: CanvasRenderingContext2D
): void {
  ctx.fillStyle = 'black';
  const t0 = performance.now();

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  if (canvasHeight === 0 || canvasWidth === 0) return;
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  objectData.faces.forEach((face) =>
    fillPolygon(face, imageData.data, canvasWidth, canvasHeight)
  );
  ctx.putImageData(imageData, 0, 0);
  //   fillPolygon(objectData.faces[401], ctx);

  const t1 = performance.now();
  console.log('filling time', t1 - t0, 'ms');
}

export function fillPolygon(
  face: Face,
  pixels: Uint8ClampedArray,
  canvasWidth: number,
  canvasHeight: number
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
    // console.log(canvasHeight);
    fillLine();

    // move to next scan line
    y++;

    // update x in AET
    activeEdgeTable.forEach((e) => (e.x += e.edgeData.slopeInverted));
  } while (activeEdgeTable.length > 0 && tempEdgeTable.length > 0);

  function fillLine() {
    if (activeEdgeTable.length % 2 !== 0) return;

    for (let i = 0; i < activeEdgeTable.length; i += 2) {
      const startX = Math.round(activeEdgeTable[i].x);
      const endX = Math.round(activeEdgeTable[i + 1].x);
      for (let x = startX; x <= endX; x++) {
        if (x > canvasWidth - 1) continue;
        const offset = (y * canvasWidth + x) * 4;
        pixels.set([0, 0, 0, 255], offset);
      }
    }
  }
}
