import { useContext } from 'react';
import { AppContext } from '../AppContext';
import './Menu.css';
import MenuObject from './MenuObject';
import MenuSize from './MenuSize';
import MenuParams from './MenuParams';
import MenuFill from './MenuFill';
import MenuLight from './MenuLight';
import MenuNormalMap from './MenuNormalMap';
import MenuDrawMode from './MenuDrawMode';

function Menu() {
  const {} = useContext(AppContext);

  return (
    <div className='menu'>
      <header>
        <h1>Object Viewer 3D</h1>
        <div className='name'>Norbert Niziołek</div>
        <a
          href='https://github.com/nizioleque/gk-lab-4'
          target='_blank'
          rel='noreferrer'
        >
          Kod źródłowy i dokumentacja
        </a>
      </header>

      <div style={{ display: 'none' }}>
        <MenuObject />
        <MenuSize />
        <MenuDrawMode />
        <MenuParams />
        <MenuFill />
        <MenuLight />
        <MenuNormalMap />
      </div>
    </div>
  );
}

export default Menu;
