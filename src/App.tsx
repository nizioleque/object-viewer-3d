import Canvas from './components/Canvas';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import Menu from './components/Menu';
import { AppContext } from './AppContext';
import useForceRerender from './hooks/useForceRerender';
import useError from './hooks/useError';
import { Face, ObjectData, Vertex } from './types';

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

  const [_objectData, setObjectData] = useState<ObjectData>();
  const readFile = (file: File) => {
    console.log(file.name);
    setObjectData(undefined);
    parseFile(file);
  };

  const parseFile = async (file: File) => {
    const vertices: string[][] = [];
    const normalVectors: string[][] = [];
    const faces: string[][] = [];
    const newObjectData: ObjectData = { faces: [] };

    const readObjectDataString = await file.text();
    const readObjectData = readObjectDataString.split('\n');

    for (const line of readObjectData) {
      const lineContent = line.split(' ');
      switch (lineContent[0]) {
        case 'v':
          vertices.push(lineContent);
          break;
        case 'vn':
          normalVectors.push(lineContent);
          break;
        case 'f':
          faces.push(lineContent);
          break;
      }
    }

    console.log(vertices.length, normalVectors.length, faces.length);

    for (const face of faces) {
      const v1Index = face[1].split('//');
      const v2Index = face[2].split('//');
      const v3Index = face[3].split('//');

      const v1 = vertices[parseInt(v1Index[0]) - 1];
      const v2 = vertices[parseInt(v2Index[0]) - 1];
      const v3 = vertices[parseInt(v3Index[0]) - 1];

      const vn1 = normalVectors[parseInt(v1Index[1]) - 1];
      const vn2 = normalVectors[parseInt(v2Index[1]) - 1];
      const vn3 = normalVectors[parseInt(v3Index[1]) - 1];

      console.log(face, v1, v2, v3);
      newObjectData.faces.push(
        new Face([
          new Vertex(v1, vn1),
          new Vertex(v2, vn2),
          new Vertex(v3, vn3),
        ])
      );
    }

    setObjectData(newObjectData);
    console.log(newObjectData);
  };

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
      value={{ canvasRef, canvasSize, setErrorText, forceRerender, readFile }}
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
