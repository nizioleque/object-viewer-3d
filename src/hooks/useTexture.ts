import { useEffect, useState } from 'react';

export interface TextureSet {
  [index: number]: string;
}

interface TextureSetBlobs {
  [index: number]: Blob;
}

export default function useTexture(size: number) {
  const [texture, setTexture] = useState<number[]>();
  const [currentTextureSet, setCurrentTextureSet] =
    useState<TextureSetBlobs | null>();
  const [currentTextureFile, setCurrentTextureFile] = useState<Blob | null>();

  const readTextureFile = (file: Blob, fromSet: boolean = false) => {
    if (!fromSet) {
      setCurrentTextureSet(null);
      setCurrentTextureFile(file);
    }

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

  const readTextureSet = async (textureSet: TextureSet) => {
    const newBlobs: TextureSetBlobs = {};
    for (const size in textureSet) {
      const response = await fetch(textureSet[size]);
      const blob = await response.blob();
      newBlobs[size] = blob;
    }
    setCurrentTextureFile(null);
    setCurrentTextureSet(newBlobs);
  };

  const updateTexture = () => {
    if (currentTextureSet) {
      const newTexture = currentTextureSet[size];
      if (newTexture) readTextureFile(newTexture, true);
    } else if (currentTextureFile) {
      readTextureFile(currentTextureFile);
    }
  };

  useEffect(() => {
    updateTexture();
  }, [size, currentTextureSet]);

  return { texture, readTextureFile, setCurrentTextureSet, readTextureSet };
}
