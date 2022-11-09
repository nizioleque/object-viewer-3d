import { useState, useEffect } from 'react';

export default function useSupportsOffscreenCanvas(
  setErrorText: (error: string, timeout?: number) => void
) {
  const [supportsOffscreenCanvas, setSupportsOffscreenCanvas] = useState<
    boolean | undefined
  >(undefined);
  useEffect(() => {
    const supported =
      typeof (document.createElement('canvas') as any)
        .transferControlToOffscreen === 'function';
    if (supported) {
      setSupportsOffscreenCanvas(true);
    } else {
      setSupportsOffscreenCanvas(false);
      setErrorText(
        'Ta przeglądarka nie wspiera rysowania wielowątkowego. Zalecane jest użycie Chrome, Edge lub Firefox',
        10000
      );
    }
  }, []);

  return supportsOffscreenCanvas;
}
