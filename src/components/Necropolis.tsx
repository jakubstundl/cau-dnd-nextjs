import { NPC } from '@prisma/client';
import styles from '../styles/Necropolis.module.css';

const Necropolis = ({
  setVisible,
  setInCombat,
  setEnemy,
}: {
  setVisible: (x: string) => void;
  setInCombat:(x:boolean)=>void;
  setEnemy: (x: NPC) => void;
}) => {
  const leaveTown = () => {
    setVisible('nada');
    setInCombat(true)
    setEnemy({
      id: 'fgfhhg',
      name: 'mimic',
      posX: 0,
      posY: 0,
      img: '/npc/mimic.png',
      dmg: 20,
      power: 5,
      cur_hp: 20,
      exp: 20,
      hp: 20
    })
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(/maps/town/necropolis.jpg)` }}
    >
      <div className={styles.chest}>
        <button onClick={leaveTown} className={styles.treasurechest}></button>
      </div>
      <button
        onClick={leaveTown}
        className="elven-leavebutton font-LOTR"
        title="Just get out, we never wanted you here!"
      >
        Leave Town
      </button>
    </div>
  );
};

export default Necropolis;
