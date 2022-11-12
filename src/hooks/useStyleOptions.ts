import { useEffect, useState } from 'react';

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

export function getColorAsArray(hex: string) {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  return [r, g, b];
}

export default function useStyleOptions() {
  const [styleOptions, setStyleOptions] = useState<StyleOptions>({
    fillType: FillType.Color,
    fillColor: [1, 1, 1],
    fillTexture: undefined,
    lightColor: [1, 1, 1],
  });

  useEffect(() => {
    console.log('new style options', JSON.stringify(styleOptions, null, 2));
  }, [styleOptions]);

  const updateStyleOptions = (options: Partial<StyleOptions>) => {
    setStyleOptions((old) => ({ ...old, ...options }));
  };

  return { styleOptions, updateStyleOptions };
}
