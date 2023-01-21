import { atom } from 'recoil';
import { ObjectData3D } from './hooks/useObject3D';

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
