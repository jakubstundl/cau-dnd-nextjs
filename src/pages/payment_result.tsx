import Header from 'components/general/Header';
import { NavigationBar } from 'components/NavigationBar';
import VideoBackground from 'components/VideoBackground';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { trpc } from 'utils/trpc';

export default function Result() {
  const router = useRouter();
  const session = useSession();
  const premium = trpc.dbRouter.createPremium.useMutation();

  // using swr because I cannot have default function asynchronous
  const { data } = useSWR(
    router.query.session_id
      ? `api/stripe/checkout/${router.query.session_id}`
      : null,
    (url) => fetch(url).then((res) => res.json()),
  );

  useEffect(() => {
    if (data?.session.status === 'complete' && session.data?.user?.id) {
      premium.mutate(session.data?.user?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <Header title="Payment Result" />
      <VideoBackground />
      <NavigationBar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div className="gold text-center font-LOTR">
          <h1 className="text-4xl">
            Payment Result:{' '}
            <strong>{data ? data.session.status : 'Loading...'}</strong>
          </h1>
          <Link href={`/user/${session.data?.user?.id}`} className="text-2xl">
            Click here to go on your user page
          </Link>
        </div>
      </div>
    </>
  );
}
