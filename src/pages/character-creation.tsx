import React, { useEffect, useState, useRef } from 'react';
import ClassList from 'components/ClassList';
import RaceList from 'components/RaceList';
import { trpc } from 'utils/trpc';
import { useSession } from 'next-auth/react';
import { appRouter } from 'server/routers/_app';
import superjson from 'superjson';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import Head from 'next/head';

import NavigationBar from 'components/NavigationBar';
import Attribute from 'components/Attribute';
import VideoBackground from 'components/VideoBackground';

export type CharacterProperties = 'str' | 'con' | 'dex' | 'int' | 'wis' | 'char';

const CreateNewChar = () => {
  const dataRaces = trpc.dbRouter.getAllRaces.useQuery();
  const races = dataRaces.data;
  const dataClasses = trpc.dbRouter.getAllClasses.useQuery();
  const classes = dataClasses.data;
  const sessionData = useSession();
  const [confirmAtr, setConfirmAtr] = useState(false);
  const nameOfChar = useRef<HTMLInputElement>(null);
  const arr: CharacterProperties[] = [
    'str',
    'dex',
    'con',
    'wis',
    'char',
    'int',
  ];
  const [selectedRace, setSelectedRace] = useState(1);
  const [character, setCharacter] = useState({
    race: '',
    class: '',
    str: 10,
    con: 10,
    dex: 10,
    int: 10,
    wis: 10,
    char: 10,
  });

  const [atrPoints, setAtrPoints] = useState(5);

  const setRace = (x: string, i: number) => {
    const updatedRace = { race: x };
    setCharacter((character) => ({
      ...character,
      ...updatedRace,
    }));
    setSelectedRace(i - 1);
  };
  const confirmation = () => setConfirmAtr(true);

  const resetChar = () => {
    setCharacter({
      class: '',
      race: '',
      str: 10,
      con: 10,
      dex: 10,
      int: 10,
      wis: 10,
      char: 10,
    });
    setConfirmAtr(false);
    setAtrPoints(5);
  };
  const setClass = (x: string) => {
    const updatedClass = { class: x };
    setCharacter((character) => ({
      ...character,
      ...updatedClass,
    }));
  };

  useEffect(() => {
    if (races) {
      arr.forEach((e) => {
        setCharacter((character) => ({
          ...character,
          ...{ [e]: 10 + races[selectedRace][e] },
        }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.race]);

  const addChar = trpc.backend.addChar.useMutation();

  const createChar = async () => {
    if (sessionData.data?.user?.id && nameOfChar.current?.value) {
      addChar.mutate({
        class: character.class,
        race: character.race,
        user_id: sessionData.data.user.id,
        name: nameOfChar.current.value,
        str: character.str,
        dex: character.dex,
        con: character.con,
        int: character.int,
        wis: character.wis,
        char: character.char,
      });
    }
  };
  const setPoints = (x: number) => {
    setAtrPoints((atrPoints) => atrPoints + x);
  };

  if (addChar.isSuccess) {
    window.location.href = 'character-list';
  }
  if (addChar.isError) {
    window.alert(addChar.error.message);
  }
  return (
    <>
      <Head>
        <title>Create new hero</title>
      </Head>
      <VideoBackground />
      <NavigationBar />
      {(!character.race || !character.class) && (
        <div test-id="creation-container">
          {!character.race && races && (
            <div
              test-id="race-selection"
              className="h-screen w-screen text-center"
            >
              <RaceList setRace={setRace} creation={true} races={races} />
            </div>
          )}
          {!character.class && character.race && classes && (
            <div test-id="class-selection">
              <ClassList
                creation={true}
                setClass={setClass}
                classes={classes}
              />
            </div>
          )}
        </div>
      )}
      {character.race && character.class && !confirmAtr && (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
          <div
            className="transparent w-1/4 rounded-3xl bg-opacity-75 bg-contain bg-center bg-no-repeat p-4 backdrop-blur-xl"
            style={{ backgroundImage: `url(/${character.class}.png)` }}
          >
            <h1 className="gold m-1 text-3xl">Race: {character.race}</h1>
            <h1 className="gold m-1 text-3xl">Class: {character.class}</h1>
            <label className="m-1 text-3xl">
              <span className="gold">Remaining points: </span>
              <input
                value={atrPoints}
                readOnly
                className="mr-1 w-10 rounded border"
              />
            </label>

            {arr.map((e: CharacterProperties) => (
              <Attribute
                key={e}
                defaultAtr={character[e]}
                name={e}
                setPoints={setPoints}
                remaining={atrPoints}
                change={(atrValue: number, atrName: CharacterProperties) => {
                  setCharacter((character) => ({
                    ...character,
                    ...{ [atrName]: atrValue },
                  }));
                }}
              />
            ))}
          </div>

          <button
            className={
              atrPoints
                ? 'invisible m-1 rounded border bg-white text-3xl'
                : 'm-1  rounded border bg-white text-3xl'
            }
            type="button"
            onClick={confirmation}
          >
            confirm attributes
          </button>
        </div>
      )}
      {character.race && character.class && confirmAtr && (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
          <div
            className="transparent w-1/4 rounded-3xl bg-opacity-75 bg-contain bg-center bg-no-repeat p-4 backdrop-blur-xl"
            style={{ backgroundImage: `url(/${character.class}.png)` }}
          >
            <div className="gold font-black">
              <p>Race:</p>
              <p className="align-items-end">{character.race}</p>
              <p>Class:</p>
              <p>{character.class}</p>
              <p>Strength:</p>
              <p>{character.str}</p>
              <p>Dexterity:</p>
              <p>{character.dex}</p>
              <p>Constitution:</p>
              <p>{character.con}</p>
              <p>Wisdom: </p>
              <p>{character.wis}</p>
              <p>Inteligence:</p>
              <p>{character.int}</p>
              <p>Charisma:</p>
              <p>{character.char}</p>
              <label className="col-start-1 col-end-3">
                Name :{' '}
                <input
                  ref={nameOfChar}
                  className=" rounded-md border border-yellow-400 bg-transparent px-3 py-2"
                  type="text"
                />
              </label>
            </div>
            <div className="mt-2 flex">
              <button
                onClick={resetChar}
                className="gold w-full rounded-md border border-yellow-400 px-10 py-2 font-black"
              >
                Reset
              </button>
              <button
                className="gold w-full rounded-md border border-yellow-400 px-10 py-2 font-black"
                onClick={createChar}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const getStaticProps = async () => {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  // prefetch `races and classes`
  await ssg.dbRouter.getAllRaces.prefetch();
  await ssg.dbRouter.getAllClasses.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
};

export default CreateNewChar;
