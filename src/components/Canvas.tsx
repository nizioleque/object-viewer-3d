import { useEffect } from 'react';
import useCanvasWorker from '../hooks/useCanvasWorker';
import useDraw3D from '../hooks/useDraw3D';
import useInterval from '../hooks/useInterval';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  objectDataState,
  objectPositionFnState,
  objectPositionState,
  renderScaleState,
} from '../atoms';
import { ObjectPosition } from '../types';

function Canvas() {
  const objectData3D = useRecoilValue(objectDataState);
  const scale = useRecoilValue(renderScaleState);
  const [objectPosition, setObjectPosition] =
    useRecoilState(objectPositionState);
  const objectPositionFn = useRecoilValue(objectPositionFnState);

  const { worker, canvasCtx, canvasRef } = useCanvasWorker();
  const { draw3D } = useDraw3D(worker, canvasCtx);

  useEffect(() => {
    draw3D();
  }, [objectData3D, draw3D, objectPosition]);

  useInterval(() => {
    const t = Date.now() / 5000;
    const newObjectPosition: ObjectPosition[] = objectPosition.map(
      (objectPosition, index) => objectPositionFn[index](objectPosition, t)
    );

    setObjectPosition(newObjectPosition);
  }, 1000 / parseFloat(process.env.REACT_APP_FPS_LIMIT ?? '60'));

  return (
    <canvas
      ref={canvasRef}
      width={1000 * scale}
      height={1000 * scale}
      style={{ border: '5px black inset', width: '800px', height: '800px' }}
    />
  );
}

export default Canvas;
