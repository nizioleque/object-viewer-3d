import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { CalculationMode } from '../types';
import './Menu.css';
import MenuSlider from './MenuSlider';
import CalculationModeButton from './CalculationModeButton';
import Button from './Button';
import { FillType, getColorAsArray } from '../hooks/useStyleOptions';
import AnimateHeight from 'react-animate-height';
import { CanvasSize } from '../hooks/useSize';

function Menu() {
  const {
    readObjectFile,
    params,
    paramSetters,
    currentFps,
    supportsOffscreenCanvas,
    styleOptions,
    updateStyleOptions,
    lightOptions,
    animationActions,
    readTextureFile,
    readTextureSet,
    size,
    setSize,
  } = useContext(AppContext);

  const readExampleObject = (path: string) => {
    fetch(path)
      .then((res) => res.blob())
      .then((blob) => {
        readObjectFile(blob);
      });
  };

  const changeZBy = (offset: number) => {
    animationActions.setLightZ(lightOptions.z + offset);
  };

  return (
    <div className='menu'>
      <header>
        <h1>Object Viewer</h1>
        <div className='name'>Norbert Niziołek</div>
        <a href='https://github.com/nizioleque/gk-lab-2' target='_blank'>
          Kod źródłowy i dokumentacja
        </a>
      </header>
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
      <div className='menu-section'>
        <h3>Wczytywanie modelu</h3>
        <div className='buttons'>
          <h5>Z pliku</h5>
          <input
            type='file'
            accept='.obj'
            onChange={(event) => {
              readObjectFile(event.target.files![0]);
            }}
          />
          <h5>Przykład</h5>
          <div
            className='menu-button horizontal'
            onClick={() => readExampleObject('/kula_1.obj')}
          >
            <div>Kula</div>
            <button className='apply-button'>Otwórz</button>
          </div>
          <div
            className='menu-button horizontal'
            onClick={() => readExampleObject('/kula_2.obj')}
          >
            <div>Kula (wektory uśrednione)</div>
            <button className='apply-button'>Otwórz</button>
          </div>
        </div>
      </div>
      <div className='menu-section'>
        <h3>Rozmiar obrazu</h3>
        <div className='buttons'>
          <Button
            text='Mały (400 pikseli)'
            value={CanvasSize.Small}
            setValue={setSize}
            currentValue={size}
          />
          <Button
            text='Średni (600 pikseli)'
            value={CanvasSize.Medium}
            setValue={setSize}
            currentValue={size}
          />
          <Button
            text='Duży (800 pikseli)'
            value={CanvasSize.Large}
            setValue={setSize}
            currentValue={size}
          />
        </div>
      </div>
      <div className='menu-section'>
        <h3>Parametry</h3>
        <div className='buttons'>
          <h5>Tryb interpolacji</h5>
          <CalculationModeButton
            text='Interpolacja koloru'
            mode={CalculationMode.InterpolateColor}
          />
          <CalculationModeButton
            text='Interpolacja wektora'
            mode={CalculationMode.InterpolateVector}
          />
          <MenuSlider
            name={
              <>
                k<sub>d</sub>
              </>
            }
            value={params.kd}
            setFn={paramSetters.setKd}
          />
          <MenuSlider
            name={
              <>
                k<sub>s</sub>
              </>
            }
            value={params.ks}
            setFn={paramSetters.setKs}
          />
          <MenuSlider
            name='m'
            value={params.m}
            setFn={paramSetters.setM}
            min={1}
            max={100}
            step={1}
            noDecimal
          />
        </div>
      </div>
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
            </div>
          </AnimateHeight>
        </div>
      </div>
      <div className='menu-section'>
        <h3>Światło</h3>
        <div className='buttons'>
          <h5>Kolor (kliknij aby wybrać)</h5>
          <input
            type='color'
            defaultValue='#ffffff'
            onChange={(event) =>
              updateStyleOptions({
                lightColor: getColorAsArray(event.target.value),
              })
            }
          />
          <h5>Współrzędna Z</h5>
          <div className='horizontal'>
            <button className='menu-button' onClick={() => changeZBy(-1)}>
              - 1
            </button>
            <button className='menu-button' onClick={() => changeZBy(-0.1)}>
              - 0.1
            </button>
            <input
              type='number'
              value={lightOptions.z}
              onChange={(event) =>
                animationActions.setLightZ(parseFloat(event.target.value))
              }
            />
            <button className='menu-button' onClick={() => changeZBy(+0.1)}>
              + 0.1
            </button>
            <button className='menu-button' onClick={() => changeZBy(+1)}>
              + 1
            </button>
          </div>
          <h5>Animacja – spirala</h5>
          <div className='horizontal flex-fill'>
            <button
              className='menu-button'
              onClick={animationActions.startAnimation}
            >
              <span className='material-symbols-outlined'>play_arrow</span>
            </button>
            <button
              className='menu-button'
              onClick={animationActions.pauseAnimation}
            >
              <span className='material-symbols-outlined'>pause</span>
            </button>
            <button
              className='menu-button'
              onClick={animationActions.resetAnimation}
            >
              <span className='material-symbols-outlined'>replay</span>
            </button>
          </div>
        </div>
      </div>
      <div className='menu-section'>
        <h3>Mapa wektorów normalnych</h3>
        <div className='buttons'></div>
      </div>
    </div>
  );
}

export default Menu;
