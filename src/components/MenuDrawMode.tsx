import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { DrawMode } from '../hooks/useDrawMode';
import Button from './Button';

function MenuDrawMode() {
  const { drawMode, setDrawMode } = useContext(AppContext);

  return (
    <div className='menu-section'>
      <h3>Rysowanie krawędzi</h3>
      <div className='buttons'>
        <Button
          text='Tylko wypełnienie'
          value={DrawMode.FillOnly}
          currentValue={drawMode}
          setValue={setDrawMode}
        />
        <Button
          text='Wypełnienie i krawędzie'
          value={DrawMode.FillOutline}
          currentValue={drawMode}
          setValue={setDrawMode}
        />
        <Button
          text='Tylko krawędzie'
          value={DrawMode.OutlineOnly}
          currentValue={drawMode}
          setValue={setDrawMode}
        />
      </div>
    </div>
  );
}

export default MenuDrawMode;
