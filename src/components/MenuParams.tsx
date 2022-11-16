import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { CalculationMode } from '../types';
import CalculationModeButton from './CalculationModeButton';
import MenuSlider from './MenuSlider';

function MenuParams() {
  const { params, paramSetters } = useContext(AppContext);

  return (
    <div className='menu-section'>
      <h3>Parametry</h3>
      <div className='buttons'>
        <h5>Tryb interpolacji</h5>
        <CalculationModeButton
          text='Interpolacja koloru'
          mode={CalculationMode.InterpolateColor}
        />
        <CalculationModeButton
          text='Interpolacja wektora'
          mode={CalculationMode.InterpolateVector}
        />
        <MenuSlider
          name={
            <>
              k<sub>d</sub>
            </>
          }
          value={params.kd}
          setFn={paramSetters.setKd}
        />
        <MenuSlider
          name={
            <>
              k<sub>s</sub>
            </>
          }
          value={params.ks}
          setFn={paramSetters.setKs}
        />
        <MenuSlider
          name='m'
          value={params.m}
          setFn={paramSetters.setM}
          min={1}
          max={100}
          step={1}
          noDecimal
        />
      </div>
    </div>
  );
}

export default MenuParams;
