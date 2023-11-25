import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Navbar, BottomNavBar } from "../components/Navbar";
import { AnimatePresence } from 'framer-motion'
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { PageContainer } from "../components/PageContainer";
import { SessionContainer } from "../components/SessionContainer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter()
	const pageKey = router.asPath
  return (
    <SessionProvider session={session}>
      <SessionContainer>
        <Navbar />
        <PageContainer>
        <AnimatePresence initial={false} mode="popLayout">
          <Component key={pageKey} {...pageProps} />
          </AnimatePresence>
        </PageContainer>
        <BottomNavBar />
      </SessionContainer>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
