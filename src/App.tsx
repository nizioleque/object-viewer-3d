import Canvas from './components/Canvas';
import './App.css';
import { useEffect } from 'react';
import Menu from './components/Menu';
import useError from './hooks/useError';
import useObject3D from './hooks/useObject3D';
import { useSetRecoilState } from 'recoil';
import { errorDataState, supportsOffscreenCanvas } from './atoms';

function App() {
  const { showError, errorText } = useError();

  useObject3D();

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
    <>
      <div className='App'>
        <Menu />
        <div className='canvas-container'>
          <Canvas />
        </div>
      </div>
      <div className={`alert ${showError ? 'show' : ''}`}>
        <div className='alert-icon'>⚠️</div>
        <div>{errorText}</div>
      </div>
    </>
  );
}

export default App;
