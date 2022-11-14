import { expose } from 'threads/worker';
import { fill } from '../canvas/fill';
import { DrawArgs } from '../types';

let ctx: CanvasRenderingContext2D | null = null;
let texture: number[] | undefined;

const worker = {
  init(offscreenCanvas: HTMLCanvasElement) {
    ctx = offscreenCanvas.getContext('2d');
  },

  setTexture(newTexture: number[] | undefined) {
    texture = newTexture;
  },

  runFill(drawArgs: DrawArgs): number {
    if (!ctx) return NaN;
    return fill(drawArgs, ctx, texture);
  },
};

export type FillWorker = typeof worker;

expose(worker);
