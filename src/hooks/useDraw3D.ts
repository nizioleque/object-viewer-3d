import { MutableRefObject, useContext, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { AppContext } from '../AppContext';
import { fovState } from '../atoms';
import { paint } from '../canvas3D/paint';
import { DrawArgs3D } from '../types';
import { FillWorker } from '../workers/fillWorker';

export default function useDraw3D(
  worker: MutableRefObject<FillWorker | undefined>,
  canvasCtx: MutableRefObject<CanvasRenderingContext2D | undefined>
) {
  const { objectData3D } = useContext(AppContext);
  const fov = useRecoilValue(fovState);

  const isRendering = useRef<boolean>(false);

  const draw3D = async () => {
    if (isRendering.current) return;
    isRendering.current = true;

    const drawArgs3D: DrawArgs3D = {
      fov: fov,
    };

    if (worker.current) {
      await worker.current.runPaint(drawArgs3D);
    } else {
      paint(drawArgs3D, canvasCtx.current!, objectData3D);
    }

    isRendering.current = false;
  };

  return { draw3D };
}
