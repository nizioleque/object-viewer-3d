import { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import useCanvasWorker from '../hooks/useCanvasWorker';
import useDraw3D from '../hooks/useDraw3D';
// import useDraw from '../hooks/useDraw';
import { CalculationMode } from '../types';

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
    setErrorText,
    mapType,
    objectData3D,
  } = useContext(AppContext);

  const { offscreenCanvas, canvasCtx, canvasRef } = useCanvasWorker();
  // const { draw } = useDraw(offscreenCanvas, worker, canvasCtx);
  const { draw3D } = useDraw3D(offscreenCanvas, canvasCtx);

  useEffect(() => {
    // draw();
    draw3D();
  }, [
    objectData,
    objectData3D,
    ...Object.values(params),
    calculationMode,
    lightOptions,
    styleOptions,
    texture,
    normalMap,
    drawMode,
    mapType,
  ]);

  useEffect(() => {
    const interval = setInterval(() => draw3D(), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      calculationMode === CalculationMode.InterpolateColor &&
      (texture || normalMap)
    ) {
      setErrorText(
        'Dla lepszego efektu wizualnego zalecane jest przełączenie w tryb interpolacji "Interpolacja wektora"'
      );
    }
  }, [texture, normalMap]);

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
