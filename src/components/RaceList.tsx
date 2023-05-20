import React, { useState } from 'react';
import RaceDetail from './RaceDetail';
import styles from '../styles/Races.module.css';
import PropTypes from  'prop-types';
import { Race } from '@prisma/client';

type RaceDetail = {
  name: string;
  id: number;
  description: string;
  dex: number;
  str: number;
  con: number;
  int: number;
  wis: number;
  char: number;
  on: boolean;
};

const RaceList = ({
  races,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setRace = () => {},
}: {
  races: Race[];
  setRace: (arg: string, id: number) => void;
}) => {
  const racesWithBoolean:RaceDetail[]=races.map((e:Race)=>{return {...e,on:false}})
  const [selectedRace, setSelectedRace] = useState(racesWithBoolean);
  const handleClick = (name: string, i: number) => {
    setRace(name, i);

    setSelectedRace((prevRace) => {
      return prevRace.map((race) => {
        return race.name === name
          ? { ...race, on: !race.on }
          : { ...race, on: false };
      });
    });
  };

  const allRaces = selectedRace.filter(race => race.name != "half-elf").map((raceBoolean: RaceDetail) => ( 
    <RaceDetail
      key={raceBoolean.id}
      id={raceBoolean.id}
      click={handleClick}
      desc={raceBoolean.description}
      name={raceBoolean.name}
      on={raceBoolean.on}
    ></RaceDetail>
  ));

  return (
    <>
      <div className={styles.body}>
        <h1 className="gold font-LOTR text-center text-4xl pt-20 tracking-widest">CHOOSE YOUR RACE</h1>
        <ul test-id="racesArr" className={styles.ul}>
          {allRaces}
        </ul>
      </div>
    </>
  );
};

RaceList.defaultProps = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setRace: () => {},
  creation: false,
}

RaceList.propTypes = {
  setRace: PropTypes.func,
  creation: PropTypes.bool,
};

export default RaceList;
