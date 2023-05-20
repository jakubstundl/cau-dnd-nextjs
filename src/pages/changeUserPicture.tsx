import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { trpc } from 'utils/trpc';
import { useRouter } from 'next/router';

const ChangeUserPicture: NextPage = () => {
  const defaultImages: string[] = [
    '/defaultUserImages/default.png',
    '/defaultUserImages/first.jpg',
    '/defaultUserImages/second.jpg',
    '/defaultUserImages/third.png',
    '/defaultUserImages/forth.jpg',
  ];
  const router = useRouter();
  const session = useSession();
  const changePic = trpc.userSettings.changeUserImage.useMutation();
  const handleClick = (ev: React.MouseEvent<HTMLElement>) => {
    const img = ev.target as HTMLImageElement;
    changePic.mutate({
      userId: session.data?.user?.id as string,
      newImage: img.alt as string,
    });
    if(session.data?.user?.id){ 
      router.push(`/user/${session.data.user.id}`);
    }
  };

  return (
    <>
      <div>
        <h1>Choose picture</h1>
        {defaultImages.map((image, index) => (
          <Image
            src={image}
            width="100"
            height="100"
            alt={image}
            key={index}
            onClick={handleClick}
          />
        ))}
      </div>
    </>
  );
};

export default ChangeUserPicture;
