import Canvas from './components/Canvas';
import './App.css';
import { useRef, useState } from 'react';
import Menu from './components/Menu';
import { AppContext } from './AppContext';
import useError from './hooks/useError';
import useSupportsOffscreenCanvas from './hooks/useSupportsOffscreenCanvas';
import useObject3D from './hooks/useObject3D';
import { RecoilRoot } from 'recoil';

function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const { showError, errorText, setErrorText } = useError();
  const supportsOffscreenCanvas = useSupportsOffscreenCanvas(setErrorText);


  const { objectData3D } = useObject3D();

  const [currentFps, setCurrentFps] = useState<number>(0);

  return (
    <RecoilRoot>
      <AppContext.Provider
        value={{
          currentFps,
          setCurrentFps,
          setErrorText,
          supportsOffscreenCanvas,
          objectData3D,
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
    </RecoilRoot>
  );
}

export default App;
