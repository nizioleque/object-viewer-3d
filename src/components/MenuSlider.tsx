import { ReactNode } from 'react';

interface MenuSliderProps {
  name: ReactNode;
  value: number;
  setFn: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  noDecimal?: boolean;
}

function MenuSlider({
  name,
  value,
  setFn,
  min,
  max,
  step,
  noDecimal,
}: MenuSliderProps) {
  return (
    <div>
      <h5>
        Współczynnik <span className='math'>{name}</span>
      </h5>
      <div className='horizontal'>
        <input
          type='range'
          min={min ?? 0}
          max={max ?? 1}
          step={step ?? 0.01}
          // defaultValue={(max ?? 1) / 2}
          value={value}
          onInput={(event) => {
            setFn(parseFloat((event.target as HTMLInputElement).value));
          }}
        />
        <div>
          {noDecimal ? value.toString().padStart(3, '0') : value.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default MenuSlider;
