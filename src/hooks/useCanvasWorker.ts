import { useCallback, useContext, useEffect, useRef } from 'react';
import { spawn, Transfer, Worker } from 'threads';
import { AppContext } from '../AppContext';
import { FillWorker } from '../workers/fillWorker';

export default function useCanvasWorker() {
  const { supportsOffscreenCanvas, texture } = useContext(AppContext);

  const offscreenCanvas = useRef<HTMLCanvasElement>();
  const worker = useRef<FillWorker>();
  const canvasCtx = useRef<CanvasRenderingContext2D>();

  const canvasRef = useCallback(
    (node: HTMLCanvasElement) => {
      if (supportsOffscreenCanvas === undefined) return;
      if (node !== null) {
        if (supportsOffscreenCanvas) {
          if (!offscreenCanvas.current) {
            offscreenCanvas.current = (
              node as any
            ).transferControlToOffscreen();
            initializeWorker();
          }
        } else {
          canvasCtx.current = node.getContext('2d', {
            willReadFrequently: true,
          })!;
        }
      }
    },
    [supportsOffscreenCanvas]
  );

  const initializeWorker = async () => {
    const newWorker = await spawn<FillWorker>(
      new Worker(
        new URL(
          '../workers/fillWorker.ts',
          import.meta.url
        ) as unknown as string
      )
    );
    newWorker.init(
      Transfer(
        offscreenCanvas.current as unknown as Transferable
      ) as unknown as HTMLCanvasElement
    );
    worker.current = newWorker as unknown as FillWorker;
  };

  useEffect(() => {
    if (worker.current) worker.current.setTexture(texture);
  }, [texture]);

  return { offscreenCanvas, worker, canvasCtx, canvasRef };
}
