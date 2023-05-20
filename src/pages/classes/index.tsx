import ClassList from 'components/ClassList';
import { trpc } from 'utils/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from 'server/routers/_app';
import superjson from 'superjson';
import Head from 'next/head';
import VideoBackground from 'components/VideoBackground';
import NavigationBar from 'components/NavigationBar';


export async function getStaticProps() {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  // prefetch `classes`
  await ssg.dbRouter.getAllClasses.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
}

export default function GetAllClasses() {
  const data = trpc.dbRouter.getAllClasses.useQuery()

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
        <title>Classes</title>
      </Head>
      <VideoBackground />
      <NavigationBar />
      <div >{data.data && <ClassList classes={data.data} />}</div>
    </>
  );
}