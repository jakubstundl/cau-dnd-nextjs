import { type NextPage } from 'next';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import VideoBackground from 'components/VideoBackground';
import NavigationBar from 'components/NavigationBar';
import Header from 'components/general/Header';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Header title="Home Page" />
      <VideoBackground />
      <NavigationBar />
      <main className="goldeffect gold mx-auto flex flex-col items-center justify-center gap-10 px-6 py-8 font-LOTR md:h-screen">
        <h1 test-id="succes delete" className=" goldeffect gold text-6xl">
          Welcome to Caverns & Unicorns
        </h1>
        {sessionData && (
        <Link className='goldeffect gold text-4xl mt-12' href={'/lobby'}>
          Start Game!
        </Link>
      )}
      </main>
      <AuthShowcase />
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <div className="text-3xl mr-10 mt-3 font-LOTR" 
      style={{
        position: 'absolute',
        top: '0',
        right: '0',
        display: 'flex',
        justifyContent: `${sessionData?.user ? 'center' : 'space-around'}`,
        alignItems: 'center',
        flexDirection:`${sessionData?.user ? 'column' : 'row'}`,
        width: '20vw',

      }}
    >
      <p className="gold text-center m-auto">{sessionData && <span>Logged in as {sessionData.user?.name}</span>}</p>

      <button
        className="goldeffect gold text-center m-auto"
        onClick={
          sessionData
            ? () => {
                signOut(), localStorage.clear();
              }
            : () => signIn()
        }
      >
        {sessionData ? 'Log Out' : 'Log In'}
      </button>
      {!sessionData && (
        <Link className='goldeffect gold' href={'/registration'}>
          Register
        </Link>
      )}
    </div>
  );
};
