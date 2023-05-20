import { Characters, NPC } from '@prisma/client';
import React from 'react';
import DragonDialog from './DragonDialog';
import ElvenTown from './ElvenTown';
import Necropolis from './Necropolis';
import Town from './Town';

const Locations = ({
  visible,
  hero,
  setHero,
  setVisible,
  setEnemy,
  setInCombat
}: {
  visible: string;
  hero: Characters;
  setHero: (x: Characters) => void;
  setVisible: (x: string) => void;
  setEnemy: (x: NPC) => void;
  setInCombat:(x:boolean)=>void;
}) => {
  return (
    <>
      {visible == 'elven' && (
        <ElvenTown setVisible={setVisible} hero={hero} setHero={setHero} />
      )}
      {visible == 'necropolis' && (
        <Necropolis setVisible={setVisible}   setInCombat={setInCombat} setEnemy={setEnemy} />
      )}
      {visible == 'town' && (
        <Town setVisible={setVisible} hero={hero} setHero={setHero} />
      )}
      {visible == 'blue-dragon-dialog' && (
        <DragonDialog setVisible={setVisible} hero={hero} />
      )}
    </>
  );
};

export default Locations;
