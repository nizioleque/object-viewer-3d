import { useEffect } from 'react';
import {
  lightSourcesState,
  objectDataState,
  objectPositionFnState,
  objectPositionState,
} from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import getExampleObjects from '../object/getExampleObject';

export default function useObject3D() {
  const setObjectData3D = useSetRecoilState(objectDataState);
  const setObjectPositionState = useSetRecoilState(objectPositionState);
  const setObjectPositionFnState = useSetRecoilState(objectPositionFnState);
  const lightSources = useRecoilValue(lightSourcesState);

  useEffect(() => {
    setExampleObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setExampleObjects = async () => {
    const { objectData, objectPosition, objectPositionFn } =
      await getExampleObjects(lightSources);

    console.log('setting object data 3d to', objectData);
    setObjectData3D(objectData);
    setObjectPositionState(objectPosition);
    setObjectPositionFnState(objectPositionFn);
  };
}
