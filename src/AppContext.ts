import { createContext, Dispatch, SetStateAction } from 'react';
import { ObjectData3D } from './hooks/useObject3D';

interface AppContext {
  setErrorText: (text: string, timeout?: number) => void;
  supportsOffscreenCanvas: boolean | undefined;
  objectData3D: ObjectData3D[];
  fov: number;
  setFov: Dispatch<SetStateAction<number>>;
  currentFps: number;
  setCurrentFps: Dispatch<SetStateAction<number>>;
}

const appContextDefaultValue: AppContext = {
  setErrorText: () => {},
  supportsOffscreenCanvas: false,
  objectData3D: [],
  fov: 0,
  setFov: () => {},
  currentFps: 0,
  setCurrentFps: () => {},
};

export const AppContext = createContext<AppContext>(appContextDefaultValue);
