import { useEffect } from 'react';
import useCanvasWorker from '../hooks/useCanvasWorker';
import useDraw3D from '../hooks/useDraw3D';
import useInterval from '../hooks/useInterval';
import { useRecoilState, useRecoilValue } from 'recoil';
import { objectDataState, objectPositionState } from '../atoms';

function Canvas() {
  const objectData3D = useRecoilValue(objectDataState);
  const [objectPosition, setObjectPosition] =
    useRecoilState(objectPositionState);

  const { worker, canvasCtx, canvasRef } = useCanvasWorker();
  const { draw3D } = useDraw3D(worker, canvasCtx);

  useEffect(() => {
    draw3D();
  }, [objectData3D, draw3D, objectPosition]);

  useInterval(() => {
    const t = Date.now() / 3000;
    setObjectPosition((currentValue) =>
      currentValue.map((pos) => ({
        ...pos,
        rotation: {
          ...pos.rotation,
          z: t * pos.rotationModifier,
        },
      }))
    );
  }, 1000 / 2);

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
