import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { CalculationMode } from '../types';
import Button from './Button';

interface CalculationModeButtonProps {
  text: string;
  mode: CalculationMode;
}

function CalculationModeButton({ text, mode }: CalculationModeButtonProps) {
  const { calculationMode, setCalculationMode } = useContext(AppContext);

  return (
    <Button
      text={text}
      value={mode}
      currentValue={calculationMode}
      setValue={setCalculationMode}
    />
  );
}

export default CalculationModeButton;
