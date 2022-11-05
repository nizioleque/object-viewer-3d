import { createContext, RefObject } from 'react';

interface AppContext {
  canvasRef: RefObject<HTMLCanvasElement>;
  canvasSize: { width: number; height: number; pixelRatio: number };
  setErrorText: (text: string) => void;
  forceRerender: () => void;
  readFile: (file: File) => void;
}

const appContextDefaultValue: AppContext = {
  canvasRef: { current: null },
  canvasSize: { width: 0, height: 0, pixelRatio: 1 },
  setErrorText: () => {},
  forceRerender: () => {},
  readFile: () => {},
};

export const AppContext = createContext<AppContext>(appContextDefaultValue);
