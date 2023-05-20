import { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { listNPC } from 'server/playground/listNPC';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import VideoBackground from 'components/VideoBackground';

const Admin: NextPage = () => {
  const session = useSession();
  const router = useRouter();
  const NPCs = listNPC;
  const [counts, setCounts] = useState<number[]>(
    Array(Object.entries(NPCs).length).fill(2),
  );
  const newGame = trpc.playground.newGame.useMutation();
  useEffect(() => {
    if (
      session &&
      session.data &&
      session.data.user &&
      !session.data.user.premium
    ) {
      router.push('/');
    }
  }, [router, session]);
  return (
    <>
      <VideoBackground />
      <div className="gold flex h-screen w-screen items-center justify-center text-9xl">
        <div>
          <h1>New Game</h1>
          {Object.entries(NPCs).map((npc, index) => (
            <Enemy
              name={npc[0]}
              key={npc[0]}
              index={index}
              setCounts={setCounts}
            />
          ))}
          <button
            onClick={() => {
              newGame.mutate(counts);
              router.push('/lobby');
            }}
          >
            Start new game
          </button>
        </div>
      </div>
    </>
  );
};
export default Admin;

const Enemy = ({
  name,
  index,
  setCounts,
}: {
  name: string;
  index: number;
  setCounts: Dispatch<SetStateAction<number[]>>;
}) => {
  const count = useRef<HTMLSpanElement>(null);
  return (
    <div>
      {name}
      <button
        onClick={() => {
          if (count.current) {
            count.current.innerHTML = `${Math.max(
              0,
              Number(count.current?.innerHTML) - 1,
            )}`;
          }
          setCounts((prev) => {
            prev[index] = Number(count.current?.innerHTML);
            return prev;
          });
        }}
      >
        -
      </button>
      <span ref={count}>2</span>
      <button
        onClick={() => {
          if (count.current) {
            count.current.innerHTML = `${Math.max(
              0,
              Number(count.current?.innerHTML) + 1,
            )}`;
          }
          setCounts((prev) => {
            prev[index] = Number(count.current?.innerHTML);
            return prev;
          });
        }}
      >
        +
      </button>
    </div>
  );
};
