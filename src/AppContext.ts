import { createContext, Dispatch, SetStateAction } from 'react';
import { DrawMode } from './hooks/useDrawMode';
import { LightOptions } from './hooks/useLightOptions';
import { MapType, NormalMapSet } from './hooks/useNormalMap';
import { ObjectData3D } from './hooks/useObject3D';
import { Params, ParamSetters } from './hooks/useParams';
import { CanvasSize } from './hooks/useSize';
import { FillType, StyleOptions } from './hooks/useStyleOptions';
import { TextureSet } from './hooks/useTexture';
import { CalculationMode, ObjectData } from './types';

interface AppContext {
  setErrorText: (text: string, timeout?: number) => void;
  forceRerender: () => void;
  readObjectFile: (file: Blob) => void;
  objectData: ObjectData | undefined;
  params: Params;
  paramSetters: ParamSetters;
  calculationMode: CalculationMode;
  setCalculationMode: Dispatch<SetStateAction<CalculationMode>>;
  supportsOffscreenCanvas: boolean | undefined;
  styleOptions: StyleOptions;
  updateStyleOptions: (options: Partial<StyleOptions>) => void;
  lightOptions: LightOptions;
  animationActions: {
    startAnimation: () => void;
    pauseAnimation: () => void;
    resetAnimation: () => void;
    setLightZ: (value: number) => void;
  };
  texture: number[] | undefined;
  readTextureFile: (file: Blob) => void;
  readTextureSet: (textureSet: TextureSet) => void;
  size: CanvasSize;
  setSize: Dispatch<SetStateAction<CanvasSize>>;
  normalMap: number[] | null;
  readNormalMapFile: (file: Blob) => void;
  readNormalMapSet: (normalMapSet: NormalMapSet, isHeightMap?: boolean) => void;
  resetNormalMap: () => void;
  drawMode: DrawMode;
  setDrawMode: Dispatch<SetStateAction<DrawMode>>;
  mapType: MapType;
  setMapType: Dispatch<SetStateAction<MapType>>;
  objectData3D: ObjectData3D[];
  fov: number;
  setFov: Dispatch<SetStateAction<number>>;
  currentFps: number;
  setCurrentFps: Dispatch<SetStateAction<number>>;
}

const appContextDefaultValue: AppContext = {
  setErrorText: () => {},
  forceRerender: () => {},
  readObjectFile: () => {},
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
  styleOptions: {
    fillColor: [],
    fillType: FillType.Color,
    lightColor: [],
  },
  updateStyleOptions: () => {},
  lightOptions: { position: { r: 0, theta: 0 }, z: 0 },
  animationActions: {
    startAnimation: () => {},
    pauseAnimation: () => {},
    resetAnimation: () => {},
    setLightZ: () => {},
  },
  texture: undefined,
  readTextureFile: () => {},
  readTextureSet: () => {},
  size: CanvasSize.Medium,
  setSize: () => {},
  normalMap: null,
  readNormalMapFile: () => {},
  readNormalMapSet: () => {},
  resetNormalMap: () => {},
  drawMode: DrawMode.FillOnly,
  setDrawMode: () => {},
  mapType: MapType.NormalMap,
  setMapType: () => {},
  objectData3D: [],
  fov: 0,
  setFov: () => {},
  currentFps: 0,
  setCurrentFps: () => {},
};

export const AppContext = createContext<AppContext>(appContextDefaultValue);
