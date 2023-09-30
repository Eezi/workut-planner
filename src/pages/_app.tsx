import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Navbar, BottomNavBar } from "../components/Navbar";
import { SideNav } from "../components/SideNav";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <div className="flex">
        {/*<div>
          <SideNav />
        </div>*/}
        <div className="grow">
          <Component {...pageProps} />
        </div>
      </div>
      <BottomNavBar />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
