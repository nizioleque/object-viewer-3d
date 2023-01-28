import { useEffect } from 'react';
import useCanvasWorker from '../hooks/useCanvasWorker';
import useDraw3D from '../hooks/useDraw3D';
import useInterval from '../hooks/useInterval';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  daylightState,
  lightSourcesState,
  objectDataState,
  objectOscillationState,
  objectPositionFnState,
  objectPositionState,
  renderScaleState,
} from '../atoms';
import { ObjectPosition } from '../types';

function Canvas() {
  const limitFps = true;
  const objectData3D = useRecoilValue(objectDataState);
  const scale = useRecoilValue(renderScaleState);
  const objectOscillation = useRecoilValue(objectOscillationState);
  const [objectPosition, setObjectPosition] =
    useRecoilState(objectPositionState);
  const objectPositionFn = useRecoilValue(objectPositionFnState);
  const [lightSources, setLightSources] = useRecoilState(lightSourcesState);
  const setDaylight = useSetRecoilState(daylightState);

  const { worker, canvasCtx, canvasRef } = useCanvasWorker();
  const { draw3D } = useDraw3D(worker, canvasCtx);

  useEffect(() => {
    draw3D();
  }, [objectData3D, draw3D, objectPosition]);

  useInterval(() => {
    const t = Date.now() / 5000;
    const newObjectPosition: ObjectPosition[] = objectPosition.map(
      (objectPosition, index) =>
        objectPositionFn[index](objectPosition, t, objectOscillation)
    );

    const newLightSources = lightSources.slice();
    newLightSources[1] = newObjectPosition[5].offset;

    let newDaylight = (t * 20) % 200;
    if (newDaylight > 100) newDaylight = 200 - newDaylight;

    setObjectPosition(newObjectPosition);
    setLightSources(newLightSources);
    setDaylight(newDaylight);
  }, 1000 / (limitFps ? parseFloat(process.env.REACT_APP_FPS_LIMIT ?? '60') : 60));

  return <canvas ref={canvasRef} width={1000 * scale} height={1000 * scale} />;
}

export default Canvas;
