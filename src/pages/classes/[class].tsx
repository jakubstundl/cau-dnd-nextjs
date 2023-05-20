import { prisma } from '../../server/db/client';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import {
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

export const getStaticProps = async (
  context: GetStaticPropsContext<{ class: string }>,
) => {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const nameOfClass = context.params?.class as string;
  await ssg.dbRouter.getClass.prefetch(nameOfClass);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      nameOfClass,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const classes = await prisma.class.findMany({ select: { name: true } });
  const paths = classes.map((className) => ({
    params: { class: className.name },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export default function GetRace(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { nameOfClass } = props;
  const data = trpc.dbRouter.getClass.useQuery(nameOfClass);
  return (
    <>
      <Header title={data.data?.name as string} />
      <NavigationBar />
      <VideoBackground />
      <div className="gold flex h-screen w-screen items-center justify-around pl-40 pr-20 font-LOTR">
        {data.data ? (
          <>
            <div className="flex flex-col items-center gap-10">
              <h1 className="text-6xl">{data.data.name}</h1>
              <div className="oneHero flex flex-col items-center justify-center">
                <Image
                  test-id={`image_${data.data.name}`}
                  src={`/${data.data.name}.png`}
                  alt={data.data.name}
                  width={350}
                  height={150}
                />
              </div>
            </div>
            <p
              className="w-[50%] text-xl gold oneHero rounded-xl tracking-widest leading-9 bg-white p-4 pl-10 pr-10 drop-shadow"
              test-id="class_details"
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
