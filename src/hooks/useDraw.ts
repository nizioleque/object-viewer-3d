import { MutableRefObject, useContext, useRef } from 'react';
import { AppContext } from '../AppContext';
import { fill } from '../canvas/fill';
import { DrawArgs } from '../types';
import { FillWorker } from '../workers/fillWorker';
import { getLightPoint } from './useLightOptions';

const rendersCount = 20;
const drawOutline = true;

export default function useDraw(
  offscreenCanvas: MutableRefObject<HTMLCanvasElement | undefined>,
  worker: MutableRefObject<FillWorker | undefined>,
  canvasCtx: MutableRefObject<CanvasRenderingContext2D | undefined>
) {
  const {
    objectData,
    lightOptions,
    params,
    setCurrentFps,
    calculationMode,
    styleOptions,
    texture,
    size,
  } = useContext(AppContext);

  const lightPosition = getLightPoint(lightOptions);

  const renderTimes = useRef<number[]>([]);
  const i = useRef<number>(0);

  const isRendering = useRef<boolean>(false);
  const nextDrawArgs = useRef<DrawArgs | undefined>(undefined);

  const draw = async () => {
    if (!offscreenCanvas) return;
    if (!objectData) return;

    const drawArgs: DrawArgs = {
      objectData,
      lightPosition,
      params,
      drawOutline,
      calculationMode,
      styleOptions,
      size,
    };

    if (isRendering.current) {
      nextDrawArgs.current = drawArgs;
      return;
    }
    isRendering.current = true;

    await _draw(drawArgs);

    if (nextDrawArgs.current) {
      await _draw(nextDrawArgs.current);
      nextDrawArgs.current = undefined;
    }

    isRendering.current = false;

    const average =
      renderTimes.current.reduce((a, b) => a + b, 0) /
      renderTimes.current.length;
    setCurrentFps(1000 / average);
  };

  const _draw = async (drawArgs: DrawArgs) => {
    let newTime = NaN;
    if (worker.current) {
      newTime = await worker.current.runFill(drawArgs);
    } else {
      newTime = fill(drawArgs, canvasCtx.current!, texture);
    }

    renderTimes.current[i.current++ % rendersCount] = newTime;
  };

  return { draw };
}
