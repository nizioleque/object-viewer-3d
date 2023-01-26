import { useRecoilState } from 'recoil';
import { fillModeState } from '../atoms';
import { FillMode } from '../types';
import Button from './Button';

function MenuFill() {
  const [fillMode, setFillMode] = useRecoilState(fillModeState);

  return (
    <div className='menu-section'>
      <h3>Tryb cieniowania</h3>
      <div className='buttons'>
        <Button
          text='Stałe'
          currentValue={fillMode}
          value={FillMode.Uniform}
          setValue={setFillMode}
        />
        <Button
          text='Gourauda'
          currentValue={fillMode}
          value={FillMode.Gouraud}
          setValue={setFillMode}
        />
        <Button
          text='Phonga'
          currentValue={fillMode}
          value={FillMode.Phong}
          setValue={setFillMode}
        />
      </div>
    </div>
  );
}

export default MenuFill;
