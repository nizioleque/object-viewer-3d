import { useState } from 'react';

export enum CanvasSize {
  Small = 400,
  Medium = 600,
  Large = 800,
}

export default function useSize() {
  const [size, setSize] = useState<CanvasSize>(CanvasSize.Medium);
  return { size, setSize };
}
