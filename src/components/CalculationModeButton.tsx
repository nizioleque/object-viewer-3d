import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { CalculationMode } from '../types';

interface CalculationModeButtonProps {
  text: string;
  mode: CalculationMode;
}

function CalculationModeButton({ text, mode }: CalculationModeButtonProps) {
  const { calculationMode, setCalculationMode } = useContext(AppContext);

  return (
    <button
      onClick={() => setCalculationMode(mode)}
      className={`menu-button ${calculationMode === mode ? 'active' : ''}`}
    >
      {text}
    </button>
  );
}

export default CalculationModeButton;
