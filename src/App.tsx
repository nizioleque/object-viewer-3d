import Canvas from './components/Canvas';
import './App.css';
import { useRef, useState } from 'react';
import Menu from './components/Menu';
import { AppContext } from './AppContext';
import useForceRerender from './hooks/useForceRerender';
import useError from './hooks/useError';
import useObjectData from './hooks/useObjectData';
import { CalculationMode } from './types';
import useParams from './hooks/useParams';
import useSupportsOffscreenCanvas from './hooks/useSupportsOffscreenCanvas';
import useStyleOptions from './hooks/useStyleOptions';
import useLightOptions from './hooks/useLightOptions';

function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const { forceRerender } = useForceRerender();
  const { showError, errorText, setErrorText } = useError();
  const { objectData, readFile } = useObjectData();
  const { params, paramSetters } = useParams();
  const supportsOffscreenCanvas = useSupportsOffscreenCanvas(setErrorText);
  const { styleOptions, updateStyleOptions } = useStyleOptions();
  const { lightOptions, animationActions } = useLightOptions();

  const [calculationMode, setCalculationMode] = useState<CalculationMode>(
    CalculationMode.InterpolateColor
  );

  const [currentFps, setCurrentFps] = useState<number>(0);

  return (
    <AppContext.Provider
      value={{
        setErrorText,
        forceRerender,
        objectData,
        readFile,
        params,
        paramSetters,
        calculationMode,
        setCalculationMode,
        supportsOffscreenCanvas,
        currentFps,
        setCurrentFps,
        styleOptions,
        updateStyleOptions,
        lightOptions,
        animationActions,
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
