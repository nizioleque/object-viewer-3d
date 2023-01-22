import { useRecoilState } from 'recoil';
import { renderScaleState } from '../atoms';
import Button from './Button';

function MenuScale() {
  const [scale, setScale] = useRecoilState(renderScaleState);

  return (
    <div className='menu-section'>
      <h3>Skalowanie</h3>
      <div className='buttons'>
        <Button
          text='100%'
          currentValue={scale}
          value={1}
          setValue={setScale}
        />
        <Button
          text='50% (4x mniej pikseli)'
          currentValue={scale}
          value={0.5}
          setValue={setScale}
        />
        <Button
          text='25% (16x mniej pikseli)'
          currentValue={scale}
          value={0.25}
          setValue={setScale}
        />
        <Button
          text='17% (36x mniej pikseli)'
          currentValue={scale}
          value={Math.round(1000 / 6) / 1000}
          setValue={setScale}
        />
      </div>
    </div>
  );
}

export default MenuScale;
