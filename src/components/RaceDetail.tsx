import React from 'react';
import styles from '../styles/OneRace.module.css';

const RaceDetail = ({
  name,
  id,
  desc,
  click,
  on,
}: {
  name: string;
  desc: string;
  click: (a:string,b:number)=>void;
  id: number
  on: boolean;
}) => {
  const handleClick = () => {
    click(name, id);
  };

  return (
    <>
      {!on && (
        <li test-id="race" className={styles.li} onClick={handleClick}>
          <div className={styles.details}>
            <img src={`/${name}.png`}></img>
          </div>
        </li>
      )}
      {on && (
        <li test-id="race" className={styles.li} onClick={handleClick}>
          <div className={styles.detailsON}>
            <p>{desc}</p>
          </div>
        </li>
      )}
    </>
  );
};

export default RaceDetail;
