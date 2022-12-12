import { useContext } from 'react';
import { AppContext } from '../AppContext';

function MenuObject() {
  const { readObjectFile } = useContext(AppContext);

  const readExampleObject = (path: string) => {
    fetch(path)
      .then((res) => res.blob())
      .then((blob) => {
        readObjectFile(blob);
      });
  };

  return (
    <div className='menu-section'>
      <h3>Wczytywanie modelu</h3>
      <div className='buttons'>
        <h5>Z pliku</h5>
        <input
          type='file'
          multiple
          accept='.obj'
          onChange={(event) => {
            readObjectFile(event.target.files![0]);
          }}
        />
        <div className='menu-caption center'>
          Przytrzymaj CTRL aby wybrać wiele plików
        </div>
        <h5>Przykład</h5>
        <div
          className='menu-button horizontal'
          onClick={() => readExampleObject('/kula_1.obj')}
        >
          <div>Kula</div>
          <button className='apply-button'>Otwórz</button>
        </div>
        <div
          className='menu-button horizontal'
          onClick={() => readExampleObject('/kula_2.obj')}
        >
          <div>Kula (wektory uśrednione)</div>
          <button className='apply-button'>Otwórz</button>
        </div>
        <div
          className='menu-button horizontal'
          onClick={() => readExampleObject('/torus_full.obj')}
        >
          <div>Torus (pełny)</div>
          <button className='apply-button'>Otwórz</button>
        </div>
      </div>
    </div>
  );
}

export default MenuObject;
