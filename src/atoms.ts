import { atom } from 'recoil';
import {
  CameraMode,
  FillMode,
  ObjectData3D,
  ObjectPosition,
  ObjectPositionFn,
  Point3D,
} from './types';

export const fovState = atom<number>({
  key: 'fovState',
  default: 90,
});

export const supportsOffscreenCanvas =
  typeof (document.createElement('canvas') as any)
    .transferControlToOffscreen === 'function';

export interface ErrorData {
  message: string;
  timeout?: number;
}

export const errorDataState = atom<ErrorData | undefined>({
  key: 'errorTextState',
  default: undefined,
});

export const currentFpsState = atom<number>({
  key: 'currentFpsState',
  default: 0,
});

export const objectDataState = atom<ObjectData3D[]>({
  key: 'objectDataState',
  default: [],
});

export const objectPositionState = atom<ObjectPosition[]>({
  key: 'objectPositionState',
  default: [],
});

export const objectPositionFnState = atom<ObjectPositionFn[]>({
  key: 'objectPositionFnState',
  default: [],
});

export const renderScaleState = atom<number>({
  key: 'renderScaleState',
  default: 1,
});

export const fillModeState = atom<FillMode>({
  key: 'fillModeState',
  default: FillMode.Uniform,
});

export const cameraModeState = atom<CameraMode>({
  key: 'cameraModeState',
  default: CameraMode.Stationary,
});

export const lightSourcesState = atom<Point3D[]>({
  key: 'lightSourcesState',
  default: [
    {
      x: 3,
      y: -0.5,
      z: 4.5,
    },
    {
      x: 0,
      y: -2,
      z: 0,
    },
    {
      x: 2,
      y: 1,
      z: -2,
    },
  ],
});
