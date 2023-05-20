import React, {  } from 'react';
import styles from '../styles/OneClass.module.css';

const ClassDetail = ({
  name,
  desc,
  click,
  on,
}: {
  name: string;
  desc: string;
  click: (a:string)=>void;
  on: boolean;
}) => {
  const handleClick = () => {
    click(name);
  };

  return (
    <>
      {!on && (
        <li test-id="class" className={styles.li} onClick={handleClick}>
          <div className={styles.details}>
            <img src={`/${name}.png`}></img>
          </div>
        </li>
      )}
      {on && (
        <li test-id="race" className={styles.li} onClick={handleClick}>
          <div className={styles.detailsON}>
            <p>{desc || 'Lorem ipsum mozna'}</p>
          </div>
        </li>
      )}
    </>
  );
};

export default ClassDetail;
