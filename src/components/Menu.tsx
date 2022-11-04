import { useContext } from 'react';
import { AppContext } from '../AppContext';
import './Menu.css';

function Menu() {
  const {} = useContext(AppContext);

  return (
    <div className='menu'>
      <header>
        <h1>Polygon Paint</h1>
        <div className='name'>Norbert Niziołek</div>
        <a href='https://github.com/nizioleque/gk-lab-2' target='_blank'>
          Kod źródłowy i dokumentacja
        </a>
      </header>
      <div className='menu-section'>
        <h3>Narzędzia</h3>
        <div className='buttons'>
          <h5>Nowe ograniczenie</h5>

          <div className='menu-caption'>
            Wybierz krawędź, następnie wprowadź długość i kliknij OK
          </div>

          <h5>Zapisz jako obraz</h5>
        </div>
      </div>
    </div>
  );
}

export default Menu;
