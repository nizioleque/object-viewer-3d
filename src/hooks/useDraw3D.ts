import { MutableRefObject, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  cameraModeState,
  currentFpsState,
  fillModeState,
  fovState,
  lightSourcesState,
  objectDataState,
  objectPositionState,
  renderScaleState,
} from '../atoms';
import { paint } from '../canvas/paint';
import { DrawArgs3D } from '../types';
import { FillWorker } from '../workers/fillWorker';

const rendersCount = 5;

export default function useDraw3D(
  worker: MutableRefObject<FillWorker | undefined>,
  canvasCtx: MutableRefObject<CanvasRenderingContext2D | undefined>
) {
  const objectData3D = useRecoilValue(objectDataState);
  const fov = useRecoilValue(fovState);
  const scale = useRecoilValue(renderScaleState);
  const fillMode = useRecoilValue(fillModeState);
  const objectPosition = useRecoilValue(objectPositionState);
  const cameraMode = useRecoilValue(cameraModeState);
  const lightSources = useRecoilValue(lightSourcesState);

  const setCurrentFps = useSetRecoilState(currentFpsState);

  const renderTimes = useRef<number[]>([]);
  const i = useRef<number>(0);

  const isRendering = useRef<boolean>(false);

  const draw3D = async () => {
    if (isRendering.current) return;
    isRendering.current = true;

    const drawArgs3D: DrawArgs3D = {
      fov,
      objectPosition,
      scale,
      fillMode,
      cameraMode,
      lightSources,
    };

    const t0 = performance.now();
    if (worker.current) {
      await worker.current.runPaint(drawArgs3D);
    } else {
      paint(drawArgs3D, canvasCtx.current!, objectData3D);
    }
    const t1 = performance.now();

    renderTimes.current[i.current++ % rendersCount] = t1 - t0;

    isRendering.current = false;

    const average =
      renderTimes.current.reduce((a, b) => a + b, 0) /
      renderTimes.current.length;
    setCurrentFps(1000 / average);
  };

  return { draw3D };
}
