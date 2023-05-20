import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Character-list.module.css';
import NavigationBar from './NavigationBar';
import VideoBackground from './VideoBackground';
import { Characters } from '@prisma/client';

type HeroList = {
  name: string;
  race: string;
  class: string;
  id: number;
};

const CharactersDetail = ({
  characters,
  handleDeletion,
  hero,
  handleClick,
}: {
  characters: Characters[];
  handleDeletion: (id: number, index: number) => void;
  hero: HeroList;
  handleClick: (
    name: string,
    race: string,
    nameOfClass: string,
    id: number,
  ) => void;
}) => {

  return (
    <>
      <NavigationBar />
      <VideoBackground />
      <section className="font-LOTR">
        <div className={styles.container}>
          {characters.length > 0 && (
            <div className={styles.heroDisplay}>
              {hero.race && (
                <Image
                  className="rounded-lg"
                  src={`/${hero.race}.png`}
                  alt={`${hero.race}`}
                  width={200}
                  height={200}
                />
              )}
              <div className="gold">
                <p className="text-2xl">{hero.name}</p>
                <p>
                  <span className="text-gray-400">
                    {hero.race} {hero.class}
                  </span>
                </p>
              </div>
            </div>
          )}
          <Link className={styles.startGameButton} href="/lobby">
            <button className="gold">Start the Game</button>
          </Link>
          {characters &&
            characters.map((e: Characters, index: number) => (
              <div
                onClick={() => handleClick(e.name, e.race, e.class, e.id)}
                className="gold oneHero col-start-4 col-end-5 row-span-1 flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 pl-10 pr-10 drop-shadow"
                key={e.id}
              >
                <div>
                  <p className="text-2xl">{e.name}</p>
                  <p>
                    <span className="text-gray-400">
                      {e.race} {e.class}
                    </span>
                  </p>
                </div>
                <div className="flex gap-5">
                  <Image
                    className="h-8 w-8 rounded-lg"
                    src={`/iconsClasses/${e.class}-icon.jpeg`}
                    alt={`${e.class}`}
                    width={15}
                    height={15}
                  />
                  <Image
                    className="h-8 w-8 rounded-lg"
                    src={`/deleteCross.png`}
                    alt={`${e.class}`}
                    width={15}
                    height={15}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeletion(e.id, index);
                    }}
                  />
                </div>
              </div>
            ))}
          {characters.length <= 8 &&
            <Link className={styles.createButton} href="/character-creation">
              <button className="gold">Create new character</button>
            </Link>
          }
        </div>
      </section>
    </>
  );
};

export default CharactersDetail;
