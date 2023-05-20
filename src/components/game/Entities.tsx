import { Characters, NPC } from '@prisma/client';
import LocationButtons from 'components/LocationButtons';
import { useState, useRef, useEffect } from 'react';
import { checkPosition } from 'utils/playground-functions';
import { trpc } from 'utils/trpc';
import NPC_Container from './NPC_Container';
import Player_Container from './Player_Container';

const Entities = ({
  setInCombat,
  setHero,
  setEnemy,
  setLocation,
  locationName,
  setVisible,
}: {
  setInCombat: (x: boolean) => void;
  setHero: (x: Characters) => void;
  setEnemy: (x: NPC) => void;
  setLocation: (x: string) => void;
  locationName: string;
  setVisible: (x: string) => void;
}) => {
  // REFS
  const map = useRef<HTMLDivElement>(null);

  // STATES
  const [name, setName] = useState<string>('');
  const [players, setPlayers] = useState<{
    [k: string]: {
      x: number;
      y: number;
      ownerId: string;
      orientation: number;
      status: { battle: boolean; alive: boolean };
    };
  }>();
  const [allDead, setAllDead] = useState<boolean>(false);

  // BACKEND PROCEDURES
  const battlePair = trpc.playground.somethingLikeBattle.useMutation();
  const enemies = trpc.playground.loadEnemies.useMutation();
  trpc.playground.sub.useSubscription(undefined, {
    onData(data) {
      setPlayers(data);
    },
  });
  trpc.playground.killNpc.useSubscription(undefined, {
    onData() {
      enemies.mutate();
    },
  });

  // USE EFFECTS
  useEffect(() => {
    enemies.mutate();

    setBp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      players &&
      name &&
      players[name] &&
      players[name].x &&
      players[name].y
    ) {
      const response = checkPosition(players[name].x, players[name].y);
      setLocation(response);
    } else {
      if (players && Object.keys(players).length === 0 && !allDead) {
        setAllDead(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  useEffect(() => {
    if (allDead) {
      window.location.href = '/game-result';
    }
  }, [allDead]);

  const startBattle = async () => {
    await setBp();
    setInCombat(true);
  };

  const setBp = async () => {
    await battlePair.mutateAsync().then((res) => {
      setHero(res.player as Characters);
      setEnemy(res.npc as NPC);
      setName(res.player.name as string);
    });
  };

  return (
    <div
      id="characters"
      ref={map}
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        height: 'auto',
        width: '80vw',
      }}
    >
      {/* Renders Players */}
      {players &&
        Object.entries(players).map(
          (
            [
              k,
              {
                x,
                y,
                orientation,
                ownerId,
                status: { battle, alive },
              },
            ],
            index,
          ) => {
            return (
              <Player_Container
                key={index}
                hero_name={k}
                map={map.current as HTMLDivElement}
                startBattle={startBattle}
                another_props={{
                  x,
                  y,
                  orientation,
                  ownerId,
                  status: { battle, alive },
                }}
              />
            );
          },
        )}

      {/* RENDER NPCs */}
      {enemies.data?.map((npc, index) => (
        <NPC_Container
          key={index}
          npc={npc}
          map={map.current as HTMLDivElement}
        />
      ))}
      {map.current?.clientWidth && (
        <LocationButtons
          locationName={locationName}
          setVisible={setVisible}
          map={map.current as HTMLDivElement}
        />
      )}
    </div>
  );
};

export default Entities;
