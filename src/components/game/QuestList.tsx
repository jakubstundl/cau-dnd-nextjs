import { Characters, Quest } from '@prisma/client';
import { useEffect } from 'react';
import { trpc } from 'utils/trpc';
import styles from '../../styles/QuestList.module.css';

const QuestList = ({
  setVisibility,
  hero,
}: {
  setVisibility: (arg: string) => void;
  hero: Characters;
}) => {
  const acceptedQuests = trpc.dbRouter.getAcceptedQuests.useMutation();
  useEffect(() => {
    acceptedQuests.mutate(hero.name);
  }, []);
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(/maps/town/parchment.svg)` }}
    >
      <button
        className={styles.closeButton}
        onClick={() => setVisibility('nada')}
        style={{ backgroundImage: `url(/deleteCross.png)` }}
      ></button>
      {acceptedQuests.data &&
        acceptedQuests.data.map((e) => {
          return <div key={e.quest.id} className="font-LOTR">{e.quest.description}{e.completed ? ' (completed)' : ' (not completed)'}</div>;
        })}
    </div>
  );
};

export default QuestList;
