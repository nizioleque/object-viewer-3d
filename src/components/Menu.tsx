import MenuFps from './MenuFps';
import './Menu.css';
import MenuFov from './MenuFov';
import MenuScale from './MenuScale';
import MenuFill from './MenuFill';
import MenuCamera from './MenuCamera';
import MenuOscillations from './MenuOscillations';
import MenuFog from './MenuFog';

function Menu() {
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
      <MenuFov />
      <MenuScale />
      <MenuFill />
      <MenuCamera />
      <MenuOscillations />
      <MenuFog />
    </div>
  );
}

export default Menu;
