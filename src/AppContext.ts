import { createContext, RefObject } from 'react';
import { ObjectData, Point3D } from './types';

interface AppContext {
  canvasRef: RefObject<HTMLCanvasElement>;
  canvasSize: { width: number; height: number; pixelRatio: number };
  setErrorText: (text: string) => void;
  forceRerender: () => void;
  readFile: (file: File) => void;
  objectData: ObjectData | undefined;
  lightPosition: Point3D;
}

const appContextDefaultValue: AppContext = {
  canvasRef: { current: null },
  canvasSize: { width: 0, height: 0, pixelRatio: 1 },
  setErrorText: () => {},
  forceRerender: () => {},
  readFile: () => {},
  objectData: undefined,
  lightPosition: { x: 0, y: 0, z: 0 },
};

export const AppContext = createContext<AppContext>(appContextDefaultValue);
