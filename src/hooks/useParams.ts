import { Dispatch, SetStateAction, useState } from 'react';

export interface Params {
  kd: number;
  ks: number;
  m: number;
}

export interface ParamSetters {
  setKd: Dispatch<SetStateAction<number>>;
  setKs: Dispatch<SetStateAction<number>>;
  setM: Dispatch<SetStateAction<number>>;
}

export default function useParams(): {
  params: Params;
  paramSetters: ParamSetters;
} {
  const [kd, setKd] = useState<number>(0.5);
  const [ks, setKs] = useState<number>(0.5);
  const [m, setM] = useState<number>(50);

  return {
    params: {
      kd,
      ks,
      m,
    },
    paramSetters: {
      setKd,
      setKs,
      setM,
    },
  };
}
