import { useContext } from 'react';
import { AppContext } from '../AppContext';
import './Menu.css';

function Menu() {
  const { readFile } = useContext(AppContext);

  const readExampleFile = (path: string) => {
    fetch(path)
      .then((res) => res.blob())
      .then((blob) => {
        readFile(blob);
      });
  };

  return (
    <div className='menu'>
      <header>
        <h1>Object Viewer</h1>
        <div className='name'>Norbert Niziołek</div>
        <a href='https://github.com/nizioleque/gk-lab-2' target='_blank'>
          Kod źródłowy i dokumentacja
        </a>
      </header>
      <div className='menu-section'>
        <h3>Wczytytanie modelu</h3>
        <div className='buttons'>
          <h5>Wczytaj z pliku</h5>
          <input
            type='file'
            accept='.obj'
            onChange={(event) => {
              readFile(event.target.files![0]);
            }}
          />
          <h5>Wczytaj przykładowy</h5>
          <div
            className='menu-button horizontal'
            onClick={() => readExampleFile('/kula_1.obj')}
          >
            <div>Kula</div>
            <button className='apply-button'>Otwórz</button>
          </div>
          <div
            className='menu-button horizontal'
            onClick={() => readExampleFile('/kula_2.obj')}
          >
            <div>Kula (wektory uśrednione)</div>
            <button className='apply-button'>Otwórz</button>
          </div>
        </div>
      </div>
      <div className='menu-section'>
        <h3>Parametry obliczeń</h3>
        <div className='buttons'>
          <h5>Suwak k_d</h5>
          <h5>Suwak k_s</h5>
          <h5>Suwak m</h5>
          <h5>Kolor I_L</h5>
        </div>
      </div>
      <div className='menu-section'>
        <h3>Wypełnienie obiektu</h3>
        <div className='buttons'>
          <h5>Kolor</h5>
          <h5>Tekstura</h5>
        </div>
      </div>
      <div className='menu-section'>
        <h3>Pozycja źródła światła</h3>
        <div className='buttons'>
          <h5>Współrzędna Z</h5>
          <h5>Uruchom animację</h5>
        </div>
      </div>
      <div className='menu-section'>
        <h3>Mapa wektorów normalnych</h3>
        <div className='buttons'></div>
      </div>
    </div>
  );
}

export default Menu;
