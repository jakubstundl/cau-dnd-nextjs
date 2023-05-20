import MapTile from 'components/MapTile';
import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { trpc } from 'utils/trpc';
import styles from '../styles/playground.module.css';
import { mapArray } from 'components/array';
import Header from 'components/general/Header';
import Battle from 'components/BattleLogic/Battle';
import { useSession } from 'next-auth/react';
import { NPC, Characters } from '@prisma/client';
import { InGameChat } from 'components/InGameChat';
import Entities from 'components/game/Entities';
import { spellOne, spellthree, spellTwo } from 'server/playground/spells';
import Locations from 'components/Locations';
import InGameMenu from 'components/game/InGameMenu';
import QuestList from 'components/game/QuestList';
import CharacterDetail from 'components/game/CharacterDetail';

const Playground: NextPage = () => {
  // ALL HOOKS AND REFS
  const session = useSession();
  const main = useRef<HTMLDivElement>(null);

  // STATES
  const [heroInfo, setHeroInfo] = useState<Characters>();
  const [location, setLocation] = useState<string>('');
  const [locationVisibility, setLocationVisibility] = useState<string>('');
  const [enemy, setEnemy] = useState<NPC>();
  const [inCombat, setInCombat] = useState(false);
  const [moveMatrix, setMoveMatrix] = useState({
    up: false,
    left: false,
    down: false,
    right: false,
    orientation: 1,
  });
  const [w, setW] = useState<boolean>(false);
  const [s, setS] = useState<boolean>(false);
  const [a, setA] = useState<boolean>(false);
  const [d, setD] = useState<boolean>(false);

  // PROCEDURES HOOKS
  const controller = trpc.playground.remoteControl.useMutation();
  const deadNPC = trpc.playground.removeDeadNpc.useMutation();
  const deadPlayer = trpc.playground.removeDeadPlayer.useMutation();
  const retreat = trpc.playground.retreat.useMutation();

  //  USE EFFECTS
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      window.location.href = '/login';
    } else if (localStorage.getItem('char_id') === null) {
      window.location.href = '/character-list';
    }
  });
  useEffect(() => {
    if (main.current) {
      main.current.focus();
    }
  }, []);

  useEffect(() => {
    if (document.activeElement === main.current) {
      controller.mutate(moveMatrix);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveMatrix]);

  const setHero = (x: Characters) => {
    setHeroInfo(x);
  };
  const setNpc = (y: NPC) => {
    setEnemy(y);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLElement>, action: boolean) => {
    if (e.repeat) {
      return;
    } else {
      switch (e.nativeEvent.key) {
        case 'w':
          if (action) {
            setW(true);
            setMoveMatrix({
              ...moveMatrix,
              up: true,
              orientation: moveMatrix.orientation > 0 ? 2 : -2,
            });
          } else {
            setW(false);
            if (a || d) {
              setMoveMatrix({
                ...moveMatrix,
                up: false,
                orientation: moveMatrix.orientation > 0 ? 2 : -2,
              });
            } else {
              setMoveMatrix({
                ...moveMatrix,
                up: false,
                orientation: moveMatrix.orientation > 0 ? 1 : -1,
              });
            }
          }
          break;
        case 'a':
          if (action) {
            setA(true);
            setMoveMatrix({ ...moveMatrix, left: true, orientation: -2 });
          } else {
            setA(false);
            if (w || s) {
              setMoveMatrix({ ...moveMatrix, left: false, orientation: -2 });
            } else {
              
              setMoveMatrix({ ...moveMatrix, left: false, orientation: -1 });
            }
          }
          break;
        case 's':
          if (action) {
            setS(true);
            setMoveMatrix({
              ...moveMatrix,
              down: true,
              orientation: moveMatrix.orientation > 0 ? 2 : -2,
            });
          } else {
            setS(false);
            if (a || d) {
              setMoveMatrix({
                ...moveMatrix,
                down: false,
                orientation: moveMatrix.orientation > 0 ? 2 : -2,
              });
            } else {
              setMoveMatrix({
                ...moveMatrix,
                down: false,
                orientation: moveMatrix.orientation > 0 ? 1 : -1,
              });
            }
          }
          break;
        case 'd':
          if (action) {
            setD(true);
            setMoveMatrix({ ...moveMatrix, right: true, orientation: 2 });
          } else {
            setD(false);
            if (w || s) {
              setMoveMatrix({ ...moveMatrix, right: false, orientation: 2 });
            } else {
              setMoveMatrix({ ...moveMatrix, right: false, orientation: 1 });
            }
          }
          break;
        default:
          break;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, true);
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    handleKey(e, false);
  };

  const exitBattleHeroWin = (hero: Characters, npc: NPC) => {
    setInCombat(false);
    deadNPC.mutate({ npcId: npc.id });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const exitBattleNpcWin = (hero: Characters, npc: NPC) => {
    setInCombat(false);
    deadPlayer.mutate();
    alert('You died! Now you are spectating other heroes!');
  };

  const runFromBattle = (hero: Characters, npc: NPC) => {
    setInCombat(false);
    const newHero = { ...hero, owner_id: session.data?.user?.id as string };
    retreat.mutate({ hero: newHero, npc: npc });
    if (main.current) {
      main.current.focus();
    }
  };

  const setLocationName = (name: string) => {
    setLocation(name);
  };

  const setVisibility = (x: string) => {
    setLocationVisibility(x);
  };

  return (
    <>
      <Header title="Playground" />
      <div
        id="mainContent"
        ref={main}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className="relative select-none overflow-hidden"
        style={{
          display: 'flex',
          background: '#92884A',
        }}
        draggable={false}
        >
        <div
          id="map"
          style={{
            aspectRatio: 16 / 9,
            position: 'relative',
            height: '80vh',
            width: '80vw',
          }}
        >
          <div
            id="mapTiles"
            className={styles.container}
            style={{
              position: 'absolute',
            }}
          >
            {mapArray.map((e, indexE) =>
              e.map((f, indexF) => (
                <MapTile
                  key={`${indexE.toString()} + ${indexF.toString()}`}
                  tileType={f}
                />
              )),
            )}
            <InGameMenu setVisibility={setVisibility} />
          </div>
          <Entities
            setHero={setHero}
            setEnemy={setNpc}
            setInCombat={setInCombat}
            setLocation={setLocationName}
            locationName={location}
            setVisible={setVisibility}
          />

          {inCombat && enemy && heroInfo && (
            <Battle
              exitBattleHeroWin={exitBattleHeroWin}
              exitBattleNpcWin={exitBattleNpcWin}
              runFromBattle={runFromBattle}
              enemyInput={enemy}
              heroInput={heroInfo}
              skillOne={spellOne}
              skillTwo={spellTwo}
              skillthree={spellthree}
            />
            )}
            {heroInfo && (<Locations setVisible={setVisibility} setInCombat={setInCombat} setEnemy={setEnemy} visible={locationVisibility} hero={heroInfo} setHero={setHero}/>)}
            {(locationVisibility=='quest-list') && heroInfo  && (<QuestList hero={heroInfo} setVisibility={setVisibility} />)}
            {(locationVisibility=='character-detail')&& heroInfo && (<CharacterDetail hero={heroInfo} setVisibility={setVisibility} />)}            
        </div>
        <InGameChat />
      </div>
    </>
  );
};

export default Playground;
