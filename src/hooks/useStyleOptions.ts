import { useState } from 'react';

export enum FillType {
  Color,
  Texture,
}

export interface StyleOptions {
  fillType: FillType;
  fillColor: number[];
  fillTexture?: File;
  lightColor: number[];
}

export default function useStyleOptions() {
  const [styleOptions, setStyleOptions] = useState<StyleOptions>({
    fillType: FillType.Color,
    fillColor: [1, 1, 1],
    fillTexture: undefined,
    lightColor: [1, 1, 1],
  });

  const updateStyleOptions = (options: Partial<StyleOptions>) => {
    setStyleOptions((old) => ({ ...old, ...options }));
  };

  return { styleOptions, updateStyleOptions };
}
