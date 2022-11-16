import { useState } from 'react';

export interface NormalMapSet {
  [index: number]: string;
}

interface NormalMapSetBlobs {
  [index: number]: Blob;
}

export default function useNormalMap() {
  const [normalMap, setNormalMap] = useState<number[]>();
  const [currentNormalMapSet, setCurrentNormalMapSet] =
    useState<NormalMapSetBlobs | null>();
  const [currentNormalMapFile, setCurrentNormalMapFile] =
    useState<Blob | null>();

  const readNormalMapFile = (file: Blob, fromSet: boolean = false) => {};

  const readNormalMapSet = async (normalMapSet: NormalMapSet) => {};

  return { normalMap, readNormalMapFile, readNormalMapSet };
}
