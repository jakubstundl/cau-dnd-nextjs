import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import RaceList from 'components/RaceList';
import { appRouter } from 'server/routers/_app';
import superjson from 'superjson';
import { trpc } from 'utils/trpc';
import Head from 'next/head';
import NavigationBar from 'components/NavigationBar';
import VideoBackground from 'components/VideoBackground';

export async function getStaticProps() {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  // prefetch `races`
  await ssg.dbRouter.getAllRaces.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
}

export default function GetAllRaces() {
  const data = trpc.dbRouter.getAllRaces.useQuery()

  if (data.status === 'error') {
    return (
      <>
        <p>Internal error occured</p>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Races</title>
      </Head>
      <VideoBackground />
      <NavigationBar />
      <div>{data.data && <RaceList races={data.data} />}</div>
    </>
  );
}