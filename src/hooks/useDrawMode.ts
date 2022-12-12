import { useState } from 'react';

export enum DrawMode {
  FillOutline,
  FillOnly,
  OutlineOnly,
}

export default function useDrawMode() {
  const [drawMode, setDrawMode] = useState<DrawMode>(DrawMode.FillOnly);
  return { drawMode, setDrawMode };
}
