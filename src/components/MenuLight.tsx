import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { getColorAsArray } from '../hooks/useStyleOptions';

function MenuLight() {
  const { updateStyleOptions, lightOptions, animationActions } =
    useContext(AppContext);

  const changeZBy = (offset: number) => {
    animationActions.setLightZ(lightOptions.z + offset);
  };

  return (
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
  );
}

export default MenuLight;
