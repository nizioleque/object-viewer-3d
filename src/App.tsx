import Canvas from './components/Canvas';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import Menu from './components/Menu';
import { AppContext } from './AppContext';
import useError from './hooks/useError';
import useObject3D from './hooks/useObject3D';
import { useSetRecoilState } from 'recoil';
import { errorDataState, supportsOffscreenCanvas } from './atoms';

function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const { showError, errorText } = useError();

  const { objectData3D } = useObject3D();

  const [currentFps, setCurrentFps] = useState<number>(0);

  const setErrorData = useSetRecoilState(errorDataState);

  useEffect(() => {
    if (!supportsOffscreenCanvas)
      setErrorData({
        message:
          'Ta przeglądarka nie wspiera rysowania wielowątkowego. Zalecane jest użycie Chrome, Edge lub Firefox',
        timeout: 10000,
      });
  }, [setErrorData]);

  return (
    <AppContext.Provider
      value={{
        currentFps,
        setCurrentFps,
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
  );
}

export default App;
