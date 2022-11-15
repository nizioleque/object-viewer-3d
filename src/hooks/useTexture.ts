import { useState } from 'react';

export default function useTexture(size: number) {
  const [texture, setTexture] = useState<number[]>();

  const readTextureFile = (file: Blob) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      const imageData = Array.from(ctx.getImageData(0, 0, size, size).data).map(
        (x) => x / 255
      );
      setTexture(imageData);
    };

    img.src = URL.createObjectURL(file);
  };

  return { texture, readTextureFile };
}
