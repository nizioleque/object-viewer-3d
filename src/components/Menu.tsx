import { useContext } from 'react';
import { AppContext } from '../AppContext';
import MenuFps from './MenuFps';
import './Menu.css';
import MenuObject from './MenuObject';
import MenuSize from './MenuSize';
import MenuParams from './MenuParams';
import MenuFill from './MenuFill';
import MenuLight from './MenuLight';
import MenuNormalMap from './MenuNormalMap';
import MenuDrawMode from './MenuDrawMode';
import MenuSlider from './MenuSlider';

function Menu() {
  const { fov, setFov } = useContext(AppContext);

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
      <MenuFps />
      <div className='menu-section'>
        <h3>FOV</h3>
        <div className='buttons'>
          <MenuSlider
            value={fov}
            setFn={setFov}
            min={30}
            max={120}
            step={1}
            defaultValue={90}
            noDecimal
          />
        </div>
      </div>

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
