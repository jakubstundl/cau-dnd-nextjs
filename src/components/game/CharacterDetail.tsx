import { Characters } from '@prisma/client';
import styles from '../../styles/CharacterDetail.module.css';

const CharacterDetail = ({
  setVisibility,
  hero,
}: {
  setVisibility: (arg: string) => void;
  hero: Characters;
}) => {
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(/${hero.race}.png)` }}
    >
      <button
        className="right-1 h-4 w-4 bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(/deleteCross.png)`  }}
        onClick={() => setVisibility('nada')}
      ></button>
      <div className="gold flex flex-col justify-center font-LOTR">
        <div>{`str : ${hero.str}`}</div>
        <div>{`dex : ${hero.dex}`}</div>
        <div>{`con : ${hero.con}`}</div>
        <div>{`int : ${hero.int}`}</div>
        <div>{`wis : ${hero.wis}`}</div>
        <div>{`char : ${hero.char}`}</div>
        <div>{`HP : ${hero.currentHP}`}</div>
        <div>{`Max HP : ${hero.maxHP}`}</div>
      </div>
      <div className="gold text-center font-LOTR">{`Name : ${hero.name}`}</div>
      <div className="gold text-center font-LOTR">{`Class : ${hero.class}`}</div>
      <div className="gold text-center font-LOTR">{` Race : ${hero.race}`}</div>
      <div></div>
    </div>
  );
};

export default CharacterDetail;
