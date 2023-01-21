import { currentFpsState, supportsOffscreenCanvas } from '../atoms';
import { useRecoilValue } from 'recoil';

function MenuFps() {
  const currentFps = useRecoilValue(currentFpsState);

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
