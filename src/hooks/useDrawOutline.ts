import { useState } from 'react';

export default function useDrawOutline() {
  const [drawOutline, setDrawOutline] = useState<boolean>(false);
  return { drawOutline, setDrawOutline };
}
