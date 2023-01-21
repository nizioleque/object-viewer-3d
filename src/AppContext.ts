import { createContext, Dispatch, SetStateAction } from 'react';
import { ObjectData3D } from './hooks/useObject3D';

interface AppContext {
  setErrorText: (text: string, timeout?: number) => void;
  supportsOffscreenCanvas: boolean | undefined;
  objectData3D: ObjectData3D[];
  currentFps: number;
  setCurrentFps: Dispatch<SetStateAction<number>>;
}

const appContextDefaultValue: AppContext = {
  setErrorText: () => {},
  supportsOffscreenCanvas: false,
  objectData3D: [],
  currentFps: 0,
  setCurrentFps: () => {},
};

export const AppContext = createContext<AppContext>(appContextDefaultValue);
