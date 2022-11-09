import { expose } from 'threads/worker';
import { fill } from '../canvas/fill';
import { Params } from '../hooks/useParams';
import { CalculationMode, ObjectData, Point3D } from '../types';

let ctx: CanvasRenderingContext2D | null = null;

const worker = {
  init(offscreenCanvas: HTMLCanvasElement) {
    ctx = offscreenCanvas.getContext('2d');
  },

  runFill(
    objectData: ObjectData,
    lightPosition: Point3D,
    params: Params,
    drawOutline: boolean,
    calculationMode: CalculationMode
  ): number {
    if (!ctx) return NaN;
    return fill(
      objectData,
      lightPosition,
      params,
      drawOutline,
      calculationMode,
      ctx
    );
  },
};

export type FillWorker = typeof worker;

expose(worker);
