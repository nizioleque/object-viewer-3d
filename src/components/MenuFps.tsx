import { useContext } from 'react';
import { AppContext } from '../AppContext';

function MenuFps() {
  const { currentFps, supportsOffscreenCanvas } = useContext(AppContext);

  return (
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
  );
}

export default MenuFps;