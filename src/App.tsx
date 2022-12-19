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
import useTexture from './hooks/useTexture';
import useSize from './hooks/useSize';
import useNormalMap from './hooks/useNormalMap';
import useDrawOutline from './hooks/useDrawMode';
import useObject3D from './hooks/useObject3D';

function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const { forceRerender } = useForceRerender();
  const { size, setSize } = useSize();
  const { showError, errorText, setErrorText } = useError();
  const { objectData, readObjectFile } = useObjectData(size);
  const { params, paramSetters } = useParams();
  const supportsOffscreenCanvas = useSupportsOffscreenCanvas(setErrorText);
  const { styleOptions, updateStyleOptions } = useStyleOptions();
  const { lightOptions, animationActions } = useLightOptions();
  const { texture, readTextureFile, readTextureSet } = useTexture(size);
  const {
    normalMap,
    readNormalMapFile,
    readNormalMapSet,
    resetNormalMap,
    mapType,
    setMapType,
  } = useNormalMap(size);
  const { drawMode, setDrawMode } = useDrawOutline();

  const [calculationMode, setCalculationMode] = useState<CalculationMode>(
    CalculationMode.InterpolateColor
  );

  const [fov, setFov] = useState<number>(90);

  const { objectData3D } = useObject3D();

  return (
    <AppContext.Provider
      value={{
        setErrorText,
        forceRerender,
        objectData,
        readObjectFile,
        params,
        paramSetters,
        calculationMode,
        setCalculationMode,
        supportsOffscreenCanvas,
        styleOptions,
        updateStyleOptions,
        lightOptions,
        animationActions,
        texture,
        readTextureFile,
        readTextureSet,
        size,
        setSize,
        normalMap,
        readNormalMapFile,
        readNormalMapSet,
        resetNormalMap,
        drawMode,
        setDrawMode,
        mapType,
        setMapType,
        objectData3D,
        fov,
        setFov
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
