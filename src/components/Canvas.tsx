import { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import useCanvasWorker from '../hooks/useCanvasWorker';
import useDraw from '../hooks/useDraw';
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
    drawOutline,
    size,
    setErrorText,
    mapType,
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
    normalMap,
    drawOutline,
    mapType,
  ]);

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

  return <canvas ref={canvasRef} width={size} height={size} />;
}

export default Canvas;
