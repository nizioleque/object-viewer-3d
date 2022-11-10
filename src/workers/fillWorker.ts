import { expose } from 'threads/worker';
import { fill } from '../canvas/fill';
import { DrawArgs } from '../types';

let ctx: CanvasRenderingContext2D | null = null;

const worker = {
  init(offscreenCanvas: HTMLCanvasElement) {
    ctx = offscreenCanvas.getContext('2d');
  },

  runFill(drawArgs: DrawArgs): number {
    if (!ctx) return NaN;
    return fill(drawArgs, ctx);
  },
};

export type FillWorker = typeof worker;

expose(worker);
