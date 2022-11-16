function MenuNormalMap() {
  return (
    <div className='menu-section'>
      <h3>Mapa wektorów normalnych</h3>
      <div className='buttons'>
        <h5>Z pliku</h5>
        <input
          type='file'
          onChange={(event) => {
            // readTextureFile(event.target.files![0]);
          }}
        />
        <h5>Przykładowa</h5>
        <div className='menu-button horizontal' onClick={() => {}}>
          <div>Brak</div>
          <button className='apply-button'>Otwórz</button>
        </div>
        <div className='menu-button horizontal' onClick={() => {}}>
          <div>Tęczowy gradient</div>
          <button className='apply-button'>Otwórz</button>
        </div>
        <div className='menu-button horizontal' onClick={() => {}}>
          <div>Biały w kropki</div>
          <button className='apply-button'>Otwórz</button>
        </div>
      </div>
    </div>
  );
}

export default MenuNormalMap;
