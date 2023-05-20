import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';
import CharactersDetail from 'components/Character-list';
import { Characters } from '@prisma/client';
import Header from 'components/general/Header';

type HeroList = {
  name: string;
  race: string;
  class: string;
  id: number;
};

const CharacterList = () => {
  const sessionData = useSession();
  const res = trpc.dbRouter.getCharacters.useMutation();
  const deletion = trpc.dbRouter.deleteCharacter.useMutation();

  const [characters, setCharacters] = useState<Characters[]>([]);
  const [hero, setHero] = useState<HeroList>({
    name: '',
    race: '',
    class: '',
    id: 0,
  });

  const handleClick = (
    name: string,
    race: string,
    nameOfClass: string,
    id: number,
  ) => {
    setHero({
      name: name,
      race: race,
      class: nameOfClass,
      id: id,
    });
    localStorage.setItem('char_id', id.toString());
  };

  const handleDeletion = (id: number, index: number) => {
    deletion.mutate(id);
    setCharacters((prevChar) => {
      prevChar.splice(index, 1);
      return prevChar;
    });
    if (localStorage.getItem('char_id') === id.toString()) {
      setHero({
        name: characters[0].name,
        race: characters[0].race,
        class: characters[0].class,
        id: characters[0].id,
      });
    }
  };

  useEffect(() => {
    if (sessionData.data?.user?.id) {
      res.mutate(sessionData.data.user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData]);

  useEffect(() => {
    if (res.data) setCharacters(res.data);
  }, [res.data]);

  useEffect(() => {
    if (sessionData.status == 'unauthenticated') {
      window.location.href = '/login';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localStorage.getItem('char_id')) {
      for (let i = 0; i < characters.length; i++) {
        if (characters[i].id.toString() == localStorage.getItem('char_id')) {
          setHero({
            name: characters[i].name,
            race: characters[i].race,
            class: characters[i].class,
            id: characters[i].id,
          });
        } else {
          setHero({
            name: characters[0].name,
            race: characters[0].race,
            class: characters[0].class,
            id: characters[0].id,
          });
        }
      }
    }
  }, [characters]);

  return (
    <>
    <Header title="Character list" />
      <div className="h-screen w-screen">
        {characters && (
          <CharactersDetail
            characters={characters}
            handleDeletion={handleDeletion}
            hero={hero}
            handleClick={handleClick}
          />
        )}
      </div>
    </>
  );
};
export default CharacterList;
