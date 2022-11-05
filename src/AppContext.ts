import { createContext, RefObject } from 'react';
import { ObjectData } from './types';

interface AppContext {
  canvasRef: RefObject<HTMLCanvasElement>;
  canvasSize: { width: number; height: number; pixelRatio: number };
  setErrorText: (text: string) => void;
  forceRerender: () => void;
  readFile: (file: File) => void;
  objectData: ObjectData | undefined;
}

const appContextDefaultValue: AppContext = {
  canvasRef: { current: null },
  canvasSize: { width: 0, height: 0, pixelRatio: 1 },
  setErrorText: () => {},
  forceRerender: () => {},
  readFile: () => {},
  objectData: undefined,
};

export const AppContext = createContext<AppContext>(appContextDefaultValue);
