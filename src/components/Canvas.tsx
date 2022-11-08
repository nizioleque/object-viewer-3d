import { useEffect, useContext, useRef, useCallback } from 'react';
import { spawn, Transfer, Worker } from 'threads';
import { AppContext } from '../AppContext';
import { fill } from '../canvas/fill';
import { scale } from '../constants';
import { FillWorker } from '../workers/fillWorker';

const rendersCount = 20;
const drawOutline = true;

function Canvas() {
  const { objectData, lightPosition, params, supportsOffscreenCanvas } =
    useContext(AppContext);

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

  const renderTimes = useRef<number[]>([]);
  const i = useRef<number>(0);

  const isRendering = useRef<boolean>(false);

  const draw = async () => {
    if (!offscreenCanvas) return;
    if (!objectData) return;
    if (isRendering.current) return;
    isRendering.current = true;

    let newTime = NaN;
    if (worker.current) {
      newTime = await worker.current.runFill(
        objectData,
        lightPosition,
        params,
        drawOutline
      );
    } else {
      newTime = fill(
        objectData,
        lightPosition,
        params,
        drawOutline,
        canvasCtx.current!
      );
    }

    renderTimes.current[i.current++ % rendersCount] = newTime;

    const average =
      renderTimes.current.reduce((a, b) => a + b, 0) /
      renderTimes.current.length;
    console.log(
      `avg fps (${renderTimes.current.length} renders)`,
      1000 / average
    );

    isRendering.current = false;
  };

  useEffect(() => {
    draw();
  }, [objectData, ...Object.values(params)]);

  return <canvas ref={canvasRef} width={scale * 2} height={scale * 2} />;
}

export default Canvas;
