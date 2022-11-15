import { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import useCanvasWorker from '../hooks/useCanvasWorker';
import useDraw from '../hooks/useDraw';

function Canvas() {
  const {
    objectData,
    params,
    calculationMode,
    lightOptions,
    styleOptions,
    texture,
    size,
  } = useContext(AppContext);

  const { offscreenCanvas, worker, canvasCtx, canvasRef } = useCanvasWorker();
  const { draw } = useDraw(offscreenCanvas, worker, canvasCtx);

  useEffect(() => {
    draw();
  }, [
    objectData,
    ...Object.values(params),
    calculationMode,
    lightOptions,
    styleOptions,
    texture,
  ]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}

export default Canvas;
