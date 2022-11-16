import { expose } from 'threads/worker';
import { fill } from '../canvas/fill';
import { DrawArgs } from '../types';

let offscreenCanvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let texture: number[] | undefined;
let normalMap: number[] | null;

const worker = {
  init(newOffscreenCanvas: HTMLCanvasElement) {
    offscreenCanvas = newOffscreenCanvas;
    ctx = offscreenCanvas?.getContext('2d');
  },

  setTexture(newTexture: number[] | undefined) {
    texture = newTexture;
  },

  setNormalMap(newNormalMap: number[] | null) {
    normalMap = newNormalMap;
  },

  setSize(size: number) {
    if (!offscreenCanvas) return;
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    ctx = offscreenCanvas?.getContext('2d');
  },

  runFill(drawArgs: DrawArgs): number {
    if (!ctx) return NaN;
    return fill(drawArgs, ctx, texture, normalMap);
  },
};

export type FillWorker = typeof worker;

expose(worker);
