import { useRecoilState } from 'recoil';
import { objectOscillationState } from '../atoms';
import Button from './Button';

function MenuOscillations() {
  const [objectOscillation, setObjectOscillation] = useRecoilState(
    objectOscillationState
  );

  return (
    <div className='menu-section'>
      <h3>Drgania obiektu</h3>
      <div className='buttons'>
        <Button
          text='Włączone'
          currentValue={objectOscillation}
          value={true}
          setValue={setObjectOscillation}
        />
        <Button
          text='Wyłączone'
          currentValue={objectOscillation}
          value={false}
          setValue={setObjectOscillation}
        />
      </div>
    </div>
  );
}

export default MenuOscillations;
