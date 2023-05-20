
import styles from '../styles/LocationButtons.module.css';

const LocationButtons = ({
  locationName,
  setVisible,
  map
}: {
  locationName: string;
  setVisible: (x: string) => void;
  map: HTMLDivElement;
}) => {
  console.error(map.clientWidth)
  return (
    <>
      <button
        onClick={() => setVisible('elven')}
        disabled={locationName == 'elven' ? false : true}
        className={styles.elven}
        style={{ 
          position: 'absolute',
          top: `${740* map.clientWidth/1600}px`,
          left: `${370*map.clientWidth/1600}px`,
          width: `${map.clientWidth/11}px`,
          height: `${map.clientWidth/35}px`
        }}
      >
        Elven Town
      </button>
      <button
        onClick={() => setVisible('necropolis')}
        disabled={locationName == 'necropolis' ? false : true}
        title="Graveyard full of treasures, what could possibly go wrong?"
        className={styles.necro}
        style={{ 
          position: 'absolute',
          top: `${350* map.clientWidth/1600}px`,
          left: `${5*map.clientWidth/1600}px`,
          width: `${map.clientWidth/11}px`,
          height: `${map.clientWidth/35}px`
        }}
      >
        Necropolis
      </button>
      <button
        onClick={() => setVisible('town')}
        disabled={locationName == 'town' ? false : true}
        className={styles.human}
        style={{ 
          position: 'absolute',
          top: `${340* map.clientWidth/1600}px`,
          left: `${560*map.clientWidth/1600}px`,
          width: `${map.clientWidth/11}px`,
          height: `${map.clientWidth/35}px`
        }}
      >
        City
      </button>
      <button
        onClick={() => {
          setVisible('dungeon');
          alert('Lukas is supposed to do this!');
        }}
        disabled={locationName == 'dungeon' ? false : true}
        title="Could it be dungeon?"
        className={styles.dung}
        style={{ 
          position: 'absolute',
          top: `${5* map.clientWidth/1600}px`,
          left: `${80*map.clientWidth/1600}px`,
          width: `${map.clientWidth/11}px`,
          height: `${map.clientWidth/35}px`
        }}
      >
        Cave
      </button>
      <button
        onClick={() => setVisible('blue-dragon-dialog')}
        disabled={locationName == 'blue-dragon-dialog' ? false : true}
        title="Big fucking dragon."
        className={styles.dragon}
        style={{ 
          position: 'absolute',
          top: `${450* map.clientWidth/1600}px`,
          left: `${1350*map.clientWidth/1600}px`,
          width: `${map.clientWidth/11}px`,
          height: `${map.clientWidth/35}px`
        }}
      >
        Dragon
      </button>
      <button
        onClick={() => {
          setVisible('ironforge');
          alert('Adam is currently working on this.. Probably?');
        }}
        disabled={locationName == 'ironforge' ? false : true}
        className={styles.ironforge}
        style={{ 
          position: 'absolute',
          top: `${50* map.clientWidth/1600}px`,
          left: `${670*map.clientWidth/1600}px`,
          width: `${map.clientWidth/11}px`,
          height: `${map.clientWidth/35}px`
        }}
      >
        Ironforge
      </button>
    </>
  );
};

export default LocationButtons;
