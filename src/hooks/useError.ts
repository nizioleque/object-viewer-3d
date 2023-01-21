import { useEffect, useState } from 'react';
import { errorDataState } from '../atoms';
import { useRecoilState } from 'recoil';

export default function useError(): {
  showError: boolean;
  errorText: string | undefined;
} {
  const [errorData, setErrorData] = useRecoilState(errorDataState);
  const errorText = errorData?.message;

  const [showError, setShowError] = useState<boolean>(false);
  const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!errorData) return;

    timeouts.forEach(clearTimeout);
    setTimeouts([]);
    setShowError(true);
    const timeout1 = setTimeout(() => {
      setShowError(false);
      const timeout2 = setTimeout(() => setErrorData(undefined), 200);
      timeouts.push(timeout2);
      setTimeouts([...timeouts, timeout2]);
    }, errorData.timeout ?? 3000);
    setTimeouts([...timeouts, timeout1]);
  }, [errorData]);

  return { showError, errorText };
}
