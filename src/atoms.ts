import { atom } from 'recoil';

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
