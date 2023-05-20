import { trpc } from 'utils/trpc';
import React, { useRef, useState } from 'react';
import styles from '../styles/Chat.module.css';

export const InGameChat= () => {
  const inputElement = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const messenger = trpc.wsRouter.inGameSendMessage.useMutation();
  const [message, setMessage] = useState<string>('');
  trpc.wsRouter.inGameRecieveMessage.useSubscription(undefined, {
    onData(data) {
      setMessages((prev: string[]) => {
        return [...prev, data];
      });
    },
  });

  return (
    <div className={styles.inGameContainer}>
     <div className={styles.inGameMessages}>
        {messages.map((m, index: number) => (
          // eslint-disable-next-line react/jsx-key
          <p key={index}>{m}</p>
        ))}
      </div>
      <input
        type="text"
        className={styles.inGameInput}
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
        className={styles.InGameButtton}
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
  );
};
