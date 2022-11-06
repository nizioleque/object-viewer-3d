import { useEffect, useContext, useRef, useMemo } from 'react';
import { AppContext } from '../AppContext';
import { drawOutlines } from '../canvas/drawOutline';
import { fill } from '../canvas/fill';

const rendersCount = 20;

function Canvas() {
  const { canvasRef, canvasSize: size, objectData } = useContext(AppContext);

  const ctx = useMemo(
    () =>
      canvasRef.current?.getContext('2d', {
        willReadFrequently: true,
      })!,
    [canvasRef.current]
  );

  const renderTimes = useRef<number[]>([]);
  const i = useRef<number>(0);

  const draw = () => {
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(
      0,
      0,
      size.width * size.pixelRatio,
      size.height * size.pixelRatio
    );

    // draw
    if (!objectData) return;

    const newTime = fill(objectData, ctx);

    drawOutlines(objectData, ctx);

    renderTimes.current[i.current++ % rendersCount] = newTime;

    const average =
      renderTimes.current.reduce((a, b) => a + b, 0) /
      renderTimes.current.length;
    console.log(
      `avg fps (${renderTimes.current.length} renders)`,
      1000 / average
    );
  };

  useEffect(() => draw(), [size, objectData]);

  return (
    <canvas
      ref={canvasRef}
      className='canvas'
      width={size.width * size.pixelRatio}
      height={size.height * size.pixelRatio}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    />
  );
}

export default Canvas;
