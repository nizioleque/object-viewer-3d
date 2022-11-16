import { useContext } from 'react';
import { AppContext } from '../AppContext';
import './Menu.css';
import MenuObject from './MenuObject';
import MenuSize from './MenuSize';
import MenuParams from './MenuParams';
import MenuFill from './MenuFill';
import MenuLight from './MenuLight';
import MenuNormalMap from './MenuNormalMap';

function Menu() {
  const { currentFps, supportsOffscreenCanvas } = useContext(AppContext);

  return (
    <div className='menu'>
      <header>
        <h1>Object Viewer</h1>
        <div className='name'>Norbert Niziołek</div>
        <a href='https://github.com/nizioleque/gk-lab-2' target='_blank'>
          Kod źródłowy i dokumentacja
        </a>
      </header>
      <div className='menu-section center'>
        <div>
          Średnie FPS: <span className='bold'>{currentFps.toFixed(0)}</span>
        </div>
        <div className='spacer' />
        <div title='Nie działa w Safari!'>
          Wielowątkowość:{' '}
          <span className={`bold ${!supportsOffscreenCanvas ? 'red' : ''}`}>
            {supportsOffscreenCanvas?.toString()}
          </span>
        </div>
      </div>
      <MenuObject />
      <MenuSize />
      <MenuParams />
      <MenuFill />
      <MenuLight />
      <MenuNormalMap />
    </div>
  );
}

export default Menu;
