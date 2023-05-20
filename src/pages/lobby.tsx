import { Chat } from 'components/Chat';
import Header from 'components/general/Header';
import NavigationBar from 'components/NavigationBar';
import VideoBackground from 'components/VideoBackground';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';
import styles from '../styles/lobby.module.css';

const Lobby = () => {
  const session = useSession();
  const router = useRouter();

  const [players, setPlayers] = useState<{ [k: string]: { [k: string]: string | number | boolean } }>(
    {},
  );
  const [prepared, setPrepared] = useState(false);
  trpc.wsRouter.onlinePlayersAfterLogin.useSubscription(undefined, {
    onData(data) {
      setPlayers((prev) => {
        return { ...prev, [data.name]: data };
      });
    },
  });
  trpc.wsRouter.sendRemovedPlayer.useSubscription(undefined, {
    onData(data) {
      setPlayers((prev) => {
        delete prev[data];
        return prev;
      });
    },
  });
  useEffect(() => {
    setPrepared(checkReadyForEveryone());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);
  useEffect(() => {
    localStorage.setItem('ready', 'false');
  }, []);

  const checkReadyForEveryone = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(players)) {
      if (value.ready === false) {
        return false;
      }
    }
    return true;
  };

  const setReady = () => {
    localStorage.getItem('ready') === 'false'
      ? localStorage.setItem('ready', 'true')
      : localStorage.setItem('ready', 'false');
  };
  const sendStart = trpc.wsRouter.sendStart.useMutation();
  const handleStart = () => {
    sendStart.mutate(players);
  };

  trpc.wsRouter.startGame.useSubscription(undefined, {
    onData(data) {
      if (data) {
        router.push('/playground');
      }
    },
  });

  return (
    <div>
      <Header title="Lobby" />
      <VideoBackground />
      <NavigationBar />
      <Chat />
      <div className={styles.container}>
        {Object.keys(players).map((e: string, index: number) => {
          return (
            <div
              key={index}
              className={styles.character}
              style={{ backgroundImage: `url(/${players[e].class}.png)` }}
            >
              {' '}
              {players[e].hero_name} : {players[e].race} {players[e].class}
              <h2>
                {players[e].name}
                {players[e].ready && ' is ready!'}
              </h2>
              {players[e].name === session.data?.user?.name && (
                <button
                  onClick={() => {
                    setReady();
                  }}
                >
                  Ready
                </button>
              )}
            </div>
          );
        })}
        <button
          disabled={!prepared}
          className={styles.startButton}
          onClick={handleStart}
        >
          Start
        </button>
        <Link className={styles.backLink} href="/character-list">
          <button className={styles.backButton}>{'<-'}</button>
        </Link>
      </div>
    </div>
  );
};

export default Lobby;
