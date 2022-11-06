import { ActiveEdgeData, EdgeData, Face, ObjectData, Point3D } from '../types';

export function fill(
  objectData: ObjectData,
  ctx: CanvasRenderingContext2D
): number {
  ctx.fillStyle = 'black';
  const t0 = performance.now();

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  if (canvasHeight === 0 || canvasWidth === 0) return 0;
  const imageData = ctx.createImageData(canvasWidth, canvasHeight);
  objectData.faces.forEach((face) =>
    fillPolygon(face, imageData.data, canvasWidth, canvasHeight)
  );
  ctx.putImageData(imageData, 0, 0);

  const t1 = performance.now();

  return t1 - t0;
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
    // fillLine();

    if (activeEdgeTable.length % 2 !== 0) return;

    for (let i = 0; i < activeEdgeTable.length; i += 2) {
      const startX = activeEdgeTable[i].x << 0;
      const endX = activeEdgeTable[i + 1].x << 0;
      for (let x = startX; x <= endX; x++) {
        if (x > canvasWidth - 1) continue;
        const offset = (y * canvasWidth + x) * 4;
        pixels.set(calculateColor(), offset);
      }
    }

    // move to next scan line
    y++;

    // update x in AET
    activeEdgeTable.forEach((e) => (e.x += e.edgeData.slopeInverted));
  } while (activeEdgeTable.length > 0 && tempEdgeTable.length > 0);
}

const V: Point3D = { x: 0, y: 0, z: 1 };
const IL = [1, 1, 1];
const IO = [1, 0.2, 0.2];

const kd = 0.5;
const ks = 0.5;
const m = 10;

function calculateColor() {

  // const cosNL = ;
  // const cosVR = ;

  // const I1;
  // const I2;

  return [
    (Math.random() * 255) << 0,
    (Math.random() * 255) << 0,
    (Math.random() * 255) << 0,
    255,
  ];
}

function prod(p1: Point3D, p2: Point3D) {
  return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
}
