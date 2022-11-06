import { Dispatch, SetStateAction, useState } from 'react';

export interface Params {
  kd: number;
  setKd: Dispatch<SetStateAction<number>>;
  ks: number;
  setKs: Dispatch<SetStateAction<number>>;
  m: number;
  setM: Dispatch<SetStateAction<number>>;
}

export default function useParams(): Params {
  const [kd, setKd] = useState<number>(0.5);
  const [ks, setKs] = useState<number>(0.5);
  const [m, setM] = useState<number>(50);

  return {
    kd,
    setKd,
    ks,
    setKs,
    m,
    setM,
  };
}
