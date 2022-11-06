import Canvas from './components/Canvas';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import Menu from './components/Menu';
import { AppContext } from './AppContext';
import useForceRerender from './hooks/useForceRerender';
import useError from './hooks/useError';
import useObjectData from './hooks/useObjectData';
import { Point3D } from './types';

function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
    pixelRatio: 1,
  });
  const updateCanvasSize = () => {
    if (!canvasContainerRef.current) return;
    setCanvasSize({
      width: canvasContainerRef.current.offsetWidth,
      height: canvasContainerRef.current.offsetHeight,
      pixelRatio: window.devicePixelRatio || 1,
    });
  };

  const { forceRerender } = useForceRerender();

  const { showError, errorText, setErrorText } = useError();

  const { objectData, readFile } = useObjectData();

  const [lightPosition, _setLightPosition] = useState<Point3D>({
    x: 0.2,
    y: 0.4,
    z: 1.1,
  });

  useEffect(() => {
    updateCanvasSize();
    const resizeHandler = () => {
      updateCanvasSize();
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <AppContext.Provider
      value={{
        canvasRef,
        canvasSize,
        setErrorText,
        forceRerender,
        objectData,
        readFile,
        lightPosition,
      }}
    >
      <div className='App'>
        <Menu />
        <div className='canvas-container' ref={canvasContainerRef}>
          <Canvas />
        </div>
      </div>
      <div className={`alert ${showError ? 'show' : ''}`}>
        <div className='alert-icon'>⚠️</div>
        <div>{errorText}</div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
