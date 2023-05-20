import Head from 'next/head';

export default function Header(props: { title: string }) {
  return (
    <>
      <Head>
        <meta name="description" content="Caverns & Unicorns" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <title>{props.title}</title>
      </Head>
    </>
  );
}
