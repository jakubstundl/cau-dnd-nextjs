import { Chat } from 'components/Chat';
import Header from 'components/general/Header';
import NavigationBar from 'components/NavigationBar';
import VideoBackground from 'components/VideoBackground';
import { useRouter } from 'next/router';
import styles from '../styles/lobby.module.css';

export default function GameResult() {
  const router = useRouter();

  return (
    <>
      <Header title="Game Result" />
      <VideoBackground />
      <NavigationBar />
      <Chat />
      <div className=" flex flex-col items-center justify-center  font-LOTR md:h-screen ">
        <div className="fixed z-10 flex h-screen w-screen items-center justify-center">
          <div className="rounded-x gold goldnohover z-30 space-y-5  p-10 drop-shadow-lg">
            <h1 className="text-center font-LOTR text-8xl">Everyone died</h1>
          </div>
          <button
            className={styles.startButton}
            role="link"
            onClick={() => router.push('/lobby')}
          >
            Lobby
          </button>
        </div>
      </div>
    </>
  );
}
