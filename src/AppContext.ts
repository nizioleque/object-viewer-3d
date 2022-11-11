import { createContext, Dispatch, SetStateAction } from 'react';
import { LightOptions } from './hooks/useLightOptions';
import { Params, ParamSetters } from './hooks/useParams';
import { FillType, StyleOptions } from './hooks/useStyleOptions';
import { CalculationMode, ObjectData } from './types';

interface AppContext {
  setErrorText: (text: string, timeout?: number) => void;
  forceRerender: () => void;
  readFile: (file: Blob) => void;
  objectData: ObjectData | undefined;
  params: Params;
  paramSetters: ParamSetters;
  calculationMode: CalculationMode;
  setCalculationMode: Dispatch<SetStateAction<CalculationMode>>;
  supportsOffscreenCanvas: boolean | undefined;
  currentFps: number;
  setCurrentFps: Dispatch<SetStateAction<number>>;
  styleOptions: StyleOptions;
  updateStyleOptions: (options: Partial<StyleOptions>) => void;
  lightOptions: LightOptions;
  animationActions: {
    startAnimation: () => void;
    pauseAnimation: () => void;
    resetAnimation: () => void;
  };
}

const appContextDefaultValue: AppContext = {
  setErrorText: () => {},
  forceRerender: () => {},
  readFile: () => {},
  objectData: undefined,
  params: {
    kd: 0,
    ks: 0,
    m: 0,
  },
  paramSetters: {
    setKd: () => {},
    setKs: () => {},
    setM: () => {},
  },
  calculationMode: CalculationMode.InterpolateColor,
  setCalculationMode: () => {},
  supportsOffscreenCanvas: undefined,
  currentFps: 0,
  setCurrentFps: () => {},
  styleOptions: {
    fillColor: [],
    fillType: FillType.Color,
    lightColor: [],
    fillTexture: undefined,
  },
  updateStyleOptions: () => {},
  lightOptions: { position: { r: 0, theta: 0 }, z: 0 },
  animationActions: {
    startAnimation: () => {},
    pauseAnimation: () => {},
    resetAnimation: () => {},
  },
};

export const AppContext = createContext<AppContext>(appContextDefaultValue);
