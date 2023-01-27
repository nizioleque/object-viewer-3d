import { useRecoilState } from 'recoil';
import { cameraModeState } from '../atoms';
import { CameraMode } from '../types';
import Button from './Button';

function MenuCamera() {
  const [cameraMode, setCameraMode] = useRecoilState(cameraModeState);

  return (
    <div className='menu-section'>
      <h3>Kamera</h3>
      <div className='buttons'>
        <Button
          text='Nieruchoma'
          currentValue={cameraMode}
          value={CameraMode.Stationary}
          setValue={setCameraMode}
        />
        <Button
          text='Podążająca za obiektem'
          currentValue={cameraMode}
          value={CameraMode.Following}
          setValue={setCameraMode}
        />
        <Button
          text='Na obiekcie'
          currentValue={cameraMode}
          value={CameraMode.Moving}
          setValue={setCameraMode}
        />
      </div>
    </div>
  );
}

export default MenuCamera;
