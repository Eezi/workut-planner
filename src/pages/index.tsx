"skip ssr";
import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { PageHead } from "../components/Head";
import PageTransition from "../components/PageTransition";

type PageProps = {};

const Home: NextPage = (
  props: PageProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const { data: sessionData, status } = useSession();
  return (
    <PageTransition ref={ref}>
      <>
        <PageHead title="Workout Plan" />
        <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Workout <span className="text-primary">Plan</span> App
          </h1>
          {status === "loading" ? (
            <span className="loading loading-spinner text-info"></span>
          ) : (
            <>
              {sessionData && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                  <Link
                    className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                    href="/workout-sessions"
                  >
                    <h3 className="text-2xl font-bold">Workout sessions</h3>
                  </Link>
                  <Link
                    className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                    href="/allworkouts"
                  >
                    <h3 className="text-2xl font-bold">All workouts</h3>
                  </Link>
                </div>
              )}
              <div className="flex flex-col items-center gap-2">
                <AuthShowcase sessionDataExists={!!sessionData} />
              </div>
            </>
          )}
        </div>
      </>
    </PageTransition>
  );
};

export default Home;

const AuthShowcase = ({
  sessionDataExists,
}: {
  sessionDataExists: boolean;
}) => {
  if (sessionDataExists) {
    return null;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionDataExists ? () => signOut() : () => signIn("google")}
      >
        {sessionDataExists ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
