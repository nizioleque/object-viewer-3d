import { useEffect, useContext, useRef, useMemo } from 'react';
import { AppContext } from '../AppContext';
import { drawOutlines } from '../canvas/drawOutline';
import { fill } from '../canvas/fill';
import { scale } from '../constants';

const rendersCount = 20;

function Canvas() {
  const { canvasRef, objectData, lightPosition, params } =
    useContext(AppContext);

  const ctx = useMemo(
    () =>
      canvasRef.current?.getContext('2d', {
        willReadFrequently: true,
      })!,
    [canvasRef.current]
  );

  const renderTimes = useRef<number[]>([]);
  const i = useRef<number>(0);

  const draw = async () => {
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, scale * 2, scale * 2);

    // draw
    if (!objectData) return;

    const newTime = fill(objectData, ctx, lightPosition, params);

    drawOutlines(objectData, ctx);

    renderTimes.current[i.current++ % rendersCount] = newTime;

    const average =
      renderTimes.current.reduce((a, b) => a + b, 0) /
      renderTimes.current.length;
    console.log(
      `avg fps (${renderTimes.current.length} renders)`,
      1000 / average
    );
    console.log(params.kd, params.ks, params.m);
  };

  useEffect(() => {
    draw();
  }, [objectData, ...Object.values(params)]);

  return <canvas ref={canvasRef} width={scale * 2} height={scale * 2} />;
}

export default Canvas;
