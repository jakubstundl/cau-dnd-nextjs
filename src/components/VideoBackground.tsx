import { NextPage } from 'next';

const VideoBackground: NextPage = () => {

  const randomVideo: number = Math.floor(Math.random() * 2);
  const videosSrc: string[] = [
    '/wallpers/tree02.mov',
    '/wallpers/forest02.mp4',
  ];
  return (
    <div
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: '-10',
      }}
    >
      <video
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        autoPlay
        muted
        loop
        id="myVideo"
      >
        <source src={videosSrc[randomVideo]} />
        <source src="/wallpers/forest02.mp4" />
        <source src="/wallpers/tree02.mov" />
      </video>
    </div>
  );
};


export default VideoBackground;
