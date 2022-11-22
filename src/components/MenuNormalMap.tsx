import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { MapType } from '../hooks/useNormalMap';
import Button from './Button';

function MenuNormalMap() {
  const {
    readNormalMapFile,
    readNormalMapSet,
    resetNormalMap,
    mapType,
    setMapType,
  } = useContext(AppContext);

  return (
    <div className='menu-section'>
      <h3>Mapa wektorów normalnych</h3>
      <div className='buttons'>
        <h5>Tryb</h5>
        <Button
          text='NormalMap'
          value={MapType.NormalMap}
          currentValue={mapType}
          setValue={setMapType}
        />
        <Button
          text='HeightMap'
          value={MapType.HeightMap}
          currentValue={mapType}
          setValue={setMapType}
        />
        <h5>Z pliku</h5>
        <input
          type='file'
          accept='image/*'
          onChange={(event) => {
            readNormalMapFile(event.target.files![0]);
          }}
        />
        <h5>Przykładowa</h5>
        <div
          className='menu-button horizontal'
          onClick={() => {
            resetNormalMap();
          }}
        >
          <div>Brak</div>
          <button className='apply-button'>Otwórz</button>
        </div>
        <div
          className='menu-button horizontal'
          onClick={() => {
            readNormalMapSet({
              400: 'brick_400.png',
              600: 'brick_600.png',
              800: 'brick_800.png',
            });
          }}
        >
          <div>Cegły</div>
          <button className='apply-button'>Otwórz</button>
        </div>
        <div
          className='menu-button horizontal'
          onClick={() => {
            readNormalMapSet({
              400: 'water_400.png',
              600: 'water_600.png',
              800: 'water_800.png',
            });
          }}
        >
          <div>Krople wody</div>
          <button className='apply-button'>Otwórz</button>
        </div>
        <div
          className='menu-button horizontal'
          onClick={() => {
            readNormalMapSet(
              {
                400: 'brick_height_400.png',
                600: 'brick_height_600.png',
                800: 'brick_height_800.png',
              },
              true
            );
          }}
        >
          <div>Cegły (HeightMap)</div>
          <button className='apply-button'>Otwórz</button>
        </div>
      </div>
    </div>
  );
}

export default MenuNormalMap;
