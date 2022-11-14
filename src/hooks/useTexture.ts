import { useState } from 'react';
import { scale } from '../constants';

export default function useTexture(width: number, height: number) {
  const [texture, setTexture] = useState<number[]>();

  const readTextureFile = (file: Blob) => {
    const canvas = document.createElement('canvas');
    canvas.width = scale * 2;
    canvas.height = scale * 2;

    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      const imageData = Array.from(
        ctx.getImageData(0, 0, width, height).data
      ).map((x) => x / 255);
      setTexture(imageData);
    };
    
    img.src = URL.createObjectURL(file);
  };

  return { texture, readTextureFile };
}
