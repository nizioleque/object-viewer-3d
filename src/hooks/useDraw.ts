import { MutableRefObject, useContext, useRef } from 'react';
import { AppContext } from '../AppContext';
import { fill } from '../canvas/fill';
import { FillWorker } from '../workers/fillWorker';

const rendersCount = 20;
const drawOutline = true;

export default function useDraw(
  offscreenCanvas: MutableRefObject<HTMLCanvasElement | undefined>,
  worker: MutableRefObject<FillWorker | undefined>,
  canvasCtx: MutableRefObject<CanvasRenderingContext2D | undefined>
) {
  const { objectData, lightPosition, params, setCurrentFps } =
    useContext(AppContext);

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

    isRendering.current = false;

    const average =
      renderTimes.current.reduce((a, b) => a + b, 0) /
      renderTimes.current.length;
    setCurrentFps(1000 / average);
  };

  return { draw };
}
