import { type NextPage } from 'next';
import { useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';
import { useRef } from 'react';
import styles from '../styles/Chat.module.css';

//import {EOL} from "os"

export const Chat: NextPage = () => {
  const inputElement = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [players, setPlayers] = useState<{ [k: string]: number }>({});
  const messenger = trpc.wsRouter.sendMessage.useMutation();
  const [message, setMessage] = useState<string>('');
  trpc.wsRouter.recieveMessage.useSubscription(undefined, {
    onData(data) {
      setMessages((prev: string[]) => {
        return [...prev, data];
      });
    },
  });
  const online = trpc.wsRouter.imOnline.useMutation();
  const onlineChars = trpc.wsRouter.onlinePlayersWithChars.useMutation();
  const removePlayer = trpc.wsRouter.removePlayer.useMutation();
  useEffect(() => {
    onlineChars.mutate({
      char_id: Number(localStorage.getItem('char_id')),
      ready: localStorage.getItem('ready') == 'true',
    });
    const onlineCheck = setInterval(() => {
      online.mutate();
      onlineChars.mutate({
        char_id: Number(localStorage.getItem('char_id')),
        ready: localStorage.getItem('ready') == 'true',
      });
      setPlayers((prev) => {
        for (const p in prev) {
          prev[p] = prev[p] + 0.5;
        }
        return prev;
      });
    }, 500);

   

    const usersCheck = setInterval(() => {
      setPlayers((prev) => {
        for (const p in prev) {
          if (prev[p] > 1.5) {
            removePlayer.mutate({name:p})
            delete prev[p];
          }
        }
        return prev;
      });
    }, 2000);
    online.mutate();
    return () => {
      clearInterval(onlineCheck);
      clearInterval(usersCheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = trpc.wsRouter.onlinePlayers.useSubscription(undefined, {
    onData(data) {
      setPlayers((prev) => {
        return { ...prev, [data]: 0 };
      });
    },
  });

  return (
    <div className='bg-cover bg-transparent' style={{backgroundImage: `url(/wallpers/morigate.svg)`}}>
      <div className="container-chat gold font-LOTR">
        <div className="row-span-1 p-1">
          Online Players:
          {Object.keys(players).map((key, index) => {
            return <div key={index}>{key}</div>;
          })}
        </div>
        <div className={styles.messages}>
          {messages.map((m, index: number) => (
            // eslint-disable-next-line react/jsx-key
            <p key={index}>{m}</p>
          ))}
        </div>
        <input
          type="text"
          className={styles.input}
          ref={inputElement}
          onChange={(ev: React.FormEvent<EventTarget>) => {
            const target: HTMLInputElement = ev.target as HTMLInputElement;
            setMessage(target.value);
          }}
          onKeyDown={(ev: React.KeyboardEvent<HTMLElement>) => {
            if (ev.key == 'Enter') {
              messenger.mutate({ typing: message });
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              inputElement.current!.value = '';
              setMessage('');
            }
          }}
        />
        <button
          className={styles.buttton}
          onClick={() => {
            messenger.mutate({ typing: message });
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            inputElement.current!.value = '';
            setMessage('');
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
