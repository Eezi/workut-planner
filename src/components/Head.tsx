import Head from "next/head";

export const PageHead = ({ title }: { title: string }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content="Save and plan your workouts" />
    <meta name="theme-color" content="#RRGGBB"></meta>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="icon" href="/icons/wa-logo-48.png" />
    <link rel="manifest" href="/manifest.json" />
  </Head>
);
