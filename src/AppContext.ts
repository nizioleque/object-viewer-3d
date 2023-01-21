import { createContext } from 'react';
import { ObjectData3D } from './hooks/useObject3D';

interface AppContext {
  objectData3D: ObjectData3D[];
}

const appContextDefaultValue: AppContext = {
  objectData3D: [],
};

export const AppContext = createContext<AppContext>(appContextDefaultValue);
