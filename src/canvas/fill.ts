import { EdgeData, Face, ObjectData } from '../types';

export function fill(
  objectData: ObjectData,
  ctx: CanvasRenderingContext2D
): void {
  objectData.faces.forEach((face) => fillPolygon(face, ctx));
}

export function fillPolygon(face: Face, ctx: CanvasRenderingContext2D) {
  const activeEdgeTable = [];

  const tempEdgeTable: EdgeData[][] = [];
  for (const edgeTableRow in face.edgeTable) {
    tempEdgeTable[edgeTableRow] = [...face.edgeTable[edgeTableRow]];
  }

  const startIndex = Math.min(...Array.from(tempEdgeTable.keys()));

  while (activeEdgeTable.length > 0 && tempEdgeTable.length > 0) {}
}
