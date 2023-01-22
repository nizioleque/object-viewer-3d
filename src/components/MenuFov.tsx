import MenuSlider from './MenuSlider';
import { useRecoilState } from 'recoil';
import { fovState } from '../atoms';

function MenuFov() {
  const [fov, setFov] = useRecoilState(fovState);

  return (
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
  );
}

export default MenuFov;
