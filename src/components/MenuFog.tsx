import { useRecoilState } from 'recoil';
import { fogState } from '../atoms';
import Button from './Button';

function MenuFog() {
  const [fog, setFog] = useRecoilState(fogState);

  return (
    <div className='menu-section'>
      <h3>Mgła</h3>
      <div className='buttons'>
        <Button
          text='Włączone'
          currentValue={fog}
          value={true}
          setValue={setFog}
        />
        <Button
          text='Wyłączone'
          currentValue={fog}
          value={false}
          setValue={setFog}
        />
      </div>
    </div>
  );
}

export default MenuFog;
