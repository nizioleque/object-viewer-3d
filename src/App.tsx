import Canvas from './components/Canvas';
import './App.css';
import { useRef, useState } from 'react';
import Menu from './components/Menu';
import { AppContext } from './AppContext';
import useForceRerender from './hooks/useForceRerender';
import useError from './hooks/useError';
import useObjectData from './hooks/useObjectData';
import { CalculationMode, Point3D } from './types';
import useParams from './hooks/useParams';

function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { forceRerender } = useForceRerender();

  const { showError, errorText, setErrorText } = useError();

  const { objectData, readFile } = useObjectData();

  const [lightPosition, _setLightPosition] = useState<Point3D>({
    x: 0.8,
    y: 1,
    z: 2,
  });

  const [calculationMode, setCalculationMode] = useState<CalculationMode>(
    CalculationMode.InterpolateColor
  );

  const params = useParams();

  return (
    <AppContext.Provider
      value={{
        canvasRef,
        setErrorText,
        forceRerender,
        objectData,
        readFile,
        lightPosition,
        params,
        calculationMode,
        setCalculationMode,
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
