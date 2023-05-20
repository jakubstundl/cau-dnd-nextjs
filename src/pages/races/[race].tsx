import { prisma } from '../../server/db/client';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import { appRouter } from 'server/routers/_app';
import superjson from 'superjson';
import { trpc } from 'utils/trpc';
import Image from 'next/image';
import Header from 'components/general/Header';
import ComponentFourOhFour from 'components/general/ComponentFourOhFour';
import NavigationBar from 'components/NavigationBar';
import VideoBackground from 'components/VideoBackground';

export async function getStaticProps(
  context: GetStaticPropsContext<{ race: string }>,
) {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const race = context.params?.race as string;
  // prefetch `race`
  await ssg.dbRouter.getRace.prefetch(race);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      race,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const races = await prisma.race.findMany({
    select: {
      name: true,
    },
  });
  return {
    paths: races.map((race) => ({
      params: {
        race: race.name,
      },
    })),
    fallback: 'blocking',
  };
};

export default function GetRace(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { race } = props;
  const data = trpc.dbRouter.getRace.useQuery(race);

  return (
    <>
      <Header title={data?.data?.name as string} />
      <NavigationBar />
      <VideoBackground />
      <div className="gold flex h-screen w-screen items-center justify-around pl-40 pr-20 font-LOTR">
        {data.data ? (
          <>
            <div className="flex flex-col items-center gap-10">
              <h1 className="text-6xl">{data.data.name}</h1>
              <div className="oneHero flex flex-col items-center justify-center">
                <Image
                  test-id={`image${data.data.name}`}
                  src={`/${data.data.name.toLowerCase()}.png`}
                  alt={data.data.name}
                  width={350}
                  height={150}
                  className=""
                />
              </div>
            </div>
            <p
              className="gold oneHero w-[50%] rounded-xl bg-white p-4 pl-10 pr-10 text-xl leading-9 tracking-widest drop-shadow"
              test-id="race_details"
            >
              {data.data.longer_desc}
            </p>
          </>
        ) : (
          <ComponentFourOhFour />
        )}
      </div>
    </>
  );
}
