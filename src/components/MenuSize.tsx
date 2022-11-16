import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { CanvasSize } from '../hooks/useSize';
import Button from './Button';

function MenuSize() {
  const { size, setSize } = useContext(AppContext);

  return (
    <div className='menu-section'>
      <h3>Rozmiar obrazu</h3>
      <div className='buttons'>
        <Button
          text='Mały (400 pikseli)'
          value={CanvasSize.Small}
          setValue={setSize}
          currentValue={size}
        />
        <Button
          text='Średni (600 pikseli)'
          value={CanvasSize.Medium}
          setValue={setSize}
          currentValue={size}
        />
        <Button
          text='Duży (800 pikseli)'
          value={CanvasSize.Large}
          setValue={setSize}
          currentValue={size}
        />
      </div>
    </div>
  );
}

export default MenuSize;
