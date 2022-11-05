import { useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';
import { drawOutlines } from '../canvas/drawOutline';
import { fill } from '../canvas/fill';

function Canvas() {
  const { canvasRef, canvasSize: size, objectData } = useContext(AppContext);
  const ctx = () => canvasRef.current?.getContext('2d', { alpha: false })!;

  const draw = () => _draw(ctx());
  const _draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(
      0,
      0,
      size.width * size.pixelRatio,
      size.height * size.pixelRatio
    );

    // draw
    objectData && drawOutlines(objectData, ctx);
    objectData && fill(objectData, ctx);
  };

  useEffect(() => draw(), [size, objectData]);
  if (ctx()) draw();

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
