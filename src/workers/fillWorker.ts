import { expose } from 'threads/worker';
import { paint } from '../canvas3D/paint';
import { ObjectData3D } from '../hooks/useObject3D';
import { DrawArgs3D } from '../types';

let offscreenCanvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let objectData3D: ObjectData3D[] | null;

const worker = {
  init(newOffscreenCanvas: HTMLCanvasElement) {
    offscreenCanvas = newOffscreenCanvas;
    ctx = offscreenCanvas?.getContext('2d');
  },

  setObjectData3D(newObjectData3D: ObjectData3D[]) {
    console.log('setobjectdata3d');
    objectData3D = newObjectData3D;
  },

  async runPaint(drawArgs3D: DrawArgs3D) {
    if (!ctx || !objectData3D) return;
    await paint(drawArgs3D, ctx, objectData3D);
  },
};

export type FillWorker = typeof worker;

expose(worker);
