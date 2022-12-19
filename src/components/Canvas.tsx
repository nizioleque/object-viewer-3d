import { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import useCanvasWorker from '../hooks/useCanvasWorker';
import useDraw3D from '../hooks/useDraw3D';
import useInterval from '../hooks/useInterval';

function Canvas() {
  const {
    objectData,
    params,
    calculationMode,
    lightOptions,
    styleOptions,
    texture,
    normalMap,
    drawMode,
    mapType,
    objectData3D,
  } = useContext(AppContext);

  const { offscreenCanvas, worker, canvasCtx, canvasRef } = useCanvasWorker();
  const { draw3D } = useDraw3D(offscreenCanvas, worker, canvasCtx);

  useEffect(() => {
    draw3D();
    console.log('objectData3D in canvas', objectData3D);
  }, [
    objectData,
    objectData3D,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...Object.values(params),
    calculationMode,
    lightOptions,
    styleOptions,
    texture,
    normalMap,
    drawMode,
    mapType,
    draw3D,
  ]);

  useInterval(() => draw3D(), 1000 / 60);

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
