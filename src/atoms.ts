import { atom } from 'recoil';

export const fovState = atom<number>({
  key: 'fovState',
  default: 90,
});
