import MenuFps from './MenuFps';
import './Menu.css';
import MenuFov from './MenuFov';
import MenuScale from './MenuScale';

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
      <MenuScale/>
    </div>
  );
}

export default Menu;
