import VideoBackground from 'components/VideoBackground';
import Link from 'next/link';
import Header from './Header';

export default function ComponentFourOhFour() {
  return (
    <>
      <Header title="404 - Page Not Found" />
      <VideoBackground />
      <div className=" flex flex-col items-center justify-center font-LOTR">
        <div className="rounded-x gold goldnohover z-30 space-y-5 p-10 drop-shadow-lg my-20">
          <h1 className="text-center font-LOTR text-6xl">
            Page Not Found
          </h1>
          <Link href="/" className="text-center my-10">
            BACK TO THE HOMEPAGE
          </Link>
        </div>
      </div>
    </>
  );
}
