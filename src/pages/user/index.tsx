import Header from 'components/general/Header';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function WithoutUserID() {
  const session = useSession();
  const router = useRouter();

  if (session.status === 'authenticated') {
    router.push(`/user/${session.data.user?.id}`);
  }

  return (
    <>
      <Header title="User Page" />
      <p>{session.data?.user?.name}</p>
      <h1>You need to be logged in</h1>
      <Link href="/login" className="w-6 border border-solid border-black">
        LOG IN
      </Link>
    </>
  );
}
