import { useContext } from 'react';
import { AppContext } from '../AppContext';
import Button from './Button';

function MenuOutline() {
  const { drawOutline, setDrawOutline } = useContext(AppContext);

  return (
    <div className='menu-section'>
      <h3>Rysowanie krawędzi</h3>
      <div className='buttons'>
        <Button
          text='Włączone'
          value={true}
          currentValue={drawOutline}
          setValue={setDrawOutline}
        />
        <Button
          text='Wyłączone'
          value={false}
          currentValue={drawOutline}
          setValue={setDrawOutline}
        />
      </div>
    </div>
  );
}

export default MenuOutline;
