import { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { scale } from '../constants';
import useCanvasWorker from '../hooks/useCanvasWorker';
import useDraw from '../hooks/useDraw';

function Canvas() {
  const { objectData, params, calculationMode, lightOptions, styleOptions } =
    useContext(AppContext);

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
  ]);

  return <canvas ref={canvasRef} width={scale * 2} height={scale * 2} />;
}

export default Canvas;
