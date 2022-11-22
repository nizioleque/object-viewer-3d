import { useEffect, useState } from 'react';

export interface NormalMapSet {
  [index: number]: string;
}

interface NormalMapSetBlobs {
  [index: number]: Blob;
}

export enum MapType {
  NormalMap,
  HeightMap,
}

export default function useNormalMap(size: number) {
  const [normalMap, setNormalMap] = useState<number[] | null>(null);
  const [currentNormalMapSet, setCurrentNormalMapSet] =
    useState<NormalMapSetBlobs | null>(null);
  const [currentNormalMapFile, setCurrentNormalMapFile] = useState<Blob | null>(
    null
  );

  const [mapType, setMapType] = useState<MapType>(MapType.NormalMap);
  useEffect(() => {
    console.log('map type changed to', mapType);
  }, [mapType]);

  const readNormalMapFile = (file: Blob, fromSet: boolean = false) => {
    if (!fromSet) {
      setCurrentNormalMapSet(null);
      setCurrentNormalMapFile(file);
    }

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      const imageData = Array.from(ctx.getImageData(0, 0, size, size).data).map(
        (x, index) => (index % 4 === 2 ? x / 127.5 - 1 : x / 255)
      );
      setNormalMap(imageData);
    };

    img.src = URL.createObjectURL(file);
  };

  const readNormalMapSet = async (
    normalMapSet: NormalMapSet,
    isHeightMap: boolean = false
  ) => {
    const newBlobs: NormalMapSetBlobs = {};
    for (const size in normalMapSet) {
      const response = await fetch(normalMapSet[size]);
      const blob = await response.blob();
      newBlobs[size] = blob;
    }
    setCurrentNormalMapFile(null);
    setCurrentNormalMapSet(newBlobs);
    setMapType(isHeightMap ? MapType.HeightMap : MapType.NormalMap);
  };

  const updateNormalMap = () => {
    if (currentNormalMapSet) {
      const newTexture = currentNormalMapSet[size];
      if (newTexture) readNormalMapFile(newTexture, true);
    } else if (currentNormalMapFile) {
      readNormalMapFile(currentNormalMapFile);
    }
  };

  useEffect(() => {
    updateNormalMap();
  }, [size, currentNormalMapSet]);

  const resetNormalMap = () => {
    setNormalMap(null);
    setCurrentNormalMapFile(null);
    setCurrentNormalMapSet(null);
  };

  return {
    normalMap,
    readNormalMapFile,
    readNormalMapSet,
    resetNormalMap,
    mapType,
    setMapType,
  };
}
