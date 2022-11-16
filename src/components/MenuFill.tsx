import { useContext } from 'react';
import AnimateHeight from 'react-animate-height';
import { AppContext } from '../AppContext';
import { FillType, getColorAsArray } from '../hooks/useStyleOptions';
import Button from './Button';

function MenuFill() {
  const { styleOptions, updateStyleOptions, readTextureFile, readTextureSet } =
    useContext(AppContext);

  return (
    <div className='menu-section'>
      <h3>Wypełnienie obiektu</h3>
      <div className='buttons'>
        <h5>Tryb</h5>
        <Button
          text='Kolor'
          value={FillType.Color}
          currentValue={styleOptions.fillType}
          setValue={(value) => updateStyleOptions({ fillType: value })}
        />
        <Button
          text='Tekstura'
          value={FillType.Texture}
          currentValue={styleOptions.fillType}
          setValue={(value) => updateStyleOptions({ fillType: value })}
        />
        <AnimateHeight
          height={styleOptions.fillType === FillType.Color ? 'auto' : 0}
          duration={300}
          easing='ease-in-out'
        >
          <div className='buttons'>
            <h5>Kolor wypełnienia (kliknij aby wybrać)</h5>
            <input
              type='color'
              defaultValue='#ffffff'
              onChange={(event) =>
                updateStyleOptions({
                  fillColor: getColorAsArray(event.target.value),
                })
              }
            />
          </div>
        </AnimateHeight>
        <AnimateHeight
          height={styleOptions.fillType === FillType.Texture ? 'auto' : 0}
          duration={300}
          easing='ease-in-out'
        >
          <div className='buttons'>
            <h5>Tekstura – z pliku</h5>
            <input
              type='file'
              accept='image/*'
              onChange={(event) => {
                readTextureFile(event.target.files![0]);
              }}
            />
            <h5>Tekstura – przykładowa</h5>
            <div
              className='menu-button horizontal'
              onClick={() =>
                readTextureSet({
                  400: 'rainbow_400.jpg',
                  600: 'rainbow_600.jpg',
                  800: 'rainbow_800.jpg',
                })
              }
            >
              <div>Tęczowy gradient</div>
              <button className='apply-button'>Otwórz</button>
            </div>
            <div
              className='menu-button horizontal'
              onClick={() =>
                readTextureSet({
                  400: 'dots_400.png',
                  600: 'dots_600.png',
                  800: 'dots_800.png',
                })
              }
            >
              <div>Biały w kropki</div>
              <button className='apply-button'>Otwórz</button>
            </div>
            <div
              className='menu-button horizontal'
              onClick={() =>
                readTextureSet({
                  400: 'kitten_400.jpg',
                  600: 'kitten_600.jpg',
                  800: 'kitten_800.jpg',
                })
              }
            >
              <div>Kotek</div>
              <button className='apply-button'>Otwórz</button>
            </div>
          </div>
        </AnimateHeight>
      </div>
    </div>
  );
}

export default MenuFill;
