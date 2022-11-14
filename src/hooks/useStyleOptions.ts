import { useState } from 'react';

export enum FillType {
  Color,
  Texture,
}

export interface StyleOptions {
  fillType: FillType;
  fillColor: number[];
  lightColor: number[];
}

export function getColorAsArray(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return [r, g, b];
}

export default function useStyleOptions() {
  const [styleOptions, setStyleOptions] = useState<StyleOptions>({
    fillType: FillType.Color,
    fillColor: [1, 1, 1],
    lightColor: [1, 1, 1],
  });

  const updateStyleOptions = (options: Partial<StyleOptions>) => {
    setStyleOptions((old) => ({ ...old, ...options }));
  };

  return { styleOptions, updateStyleOptions };
}
