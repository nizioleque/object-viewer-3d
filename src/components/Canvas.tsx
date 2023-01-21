import { useEffect } from 'react';
import useCanvasWorker from '../hooks/useCanvasWorker';
import useDraw3D from '../hooks/useDraw3D';
import useInterval from '../hooks/useInterval';
import { useRecoilValue } from 'recoil';
import { objectDataState } from '../atoms';

function Canvas() {
  const objectData3D = useRecoilValue(objectDataState);

  const { worker, canvasCtx, canvasRef } = useCanvasWorker();
  const { draw3D } = useDraw3D(worker, canvasCtx);

  useEffect(() => {
    draw3D();
  }, [objectData3D, draw3D]);

  useInterval(() => {
    draw3D();
  }, 1000 / 0.2);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={1000}
      style={{ border: '5px black inset' }}
    />
  );
}

export default Canvas;
