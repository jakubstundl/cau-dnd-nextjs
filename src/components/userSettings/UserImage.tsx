import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect } from 'react';
import { trpc } from 'utils/trpc';

const UserImage = () => {
  const session = useSession();
  const userImage = trpc.userSettings.userImage.useMutation();


  const handleClick = () => {
    // 1.1 zobrazeni obrazku na vyber pod aktualnim obrazkem
    // setShowPics(!showPics)
    window.location.href = '/changeUserPicture';
  };

  useEffect(() => {
    if (session?.data?.user?.id) {
      userImage.mutate({ userId: session?.data?.user?.id as string });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.data?.user?.id]);
  return (
    <>
      <h3>{session.data?.user?.name}</h3>
      <Image
        src={(userImage.data as string) || '/defaultUserImages/default.png'}
        width="100"
        height="100"
        alt={(userImage.data as string) || '/defaultUserImages/default.png'}
        onClick={handleClick}
      />
    </>
  );
};


export default UserImage;
