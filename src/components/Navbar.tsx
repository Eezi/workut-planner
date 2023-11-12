import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

const pages = [
  {
    link: "/statistics",
    name: "Statics",
  },
  {
    link: "/workout-sessions",
    name: "Sessions",
  },
  {
    link: "/allworkouts",
    name: "Sessions",
  },
  {
    link: "/create-workout/[slug]",
    name: "Create workout",
  },
];

const LoggedInNav = () => {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  return (
    <>
      <div className="hidden gap-0 font-semibold md:flex md:gap-7">
        {pages.map(({ link, name }) => {
          const isActive = pathname === link;
          if (name === "Create workout") {
            return (
              <Link
                key={link}
                href={{
                  pathname: "/create-workout/[slug]",
                  query: { slug: "create" },
                }}
              >
                Create Workout
              </Link>
            );
          }
          return (
            <Link
              style={{
                borderBottom: isActive ? "2px solid white" : "none",
              }}
              key={link}
              href={link}
            >
              {name}
            </Link>
          );
        })}
      </div>
      <div className="dropdown-end dropdown">
        <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
          <div className="w-8 rounded-full">
            <img alt="user-image" src={sessionData?.user?.image || ""} />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
        >
          <li>
            <a onClick={() => signOut()}>Logout</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export const Navbar = () => {
  return (
    <div data-theme="nightforest" className="navbar">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-xl normal-case">
          Workout App
        </Link>
      </div>
      <LoggedInNav />
    </div>
  );
};

export const BottomNavBar = () => {
  const { data: sessionData } = useSession();
  // Tämä pitäisi eristää omaksi componenteiksi jotta saadaan active className lisättyä kivasti
  // className="active"
  // const router = useRouter();

  if (!sessionData) return null;

  // VOisko tää layout issue johtua siitä että tätä käytetään väärässä paikassa
  //
  //const isDesktop = window.screen.width > 768;

  //if (isDesktop) return null;

  return (
    <div
      data-theme="nightforest"
      className="btm-nav fixed bottom-0 p-2 pb-5 md:hidden"
    >
      <Link href="/workout-sessions">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className="btm-nav-label text-xs">Sessions</span>
      </Link>
      <Link href="/allworkouts">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>

        <span className="btm-nav-label text-xs">Workouts</span>
      </Link>
      <Link href="/statistics">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <rect
            width="48"
            height="160"
            x="64"
            y="320"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            rx="8"
            ry="8"
          />
          <rect
            width="48"
            height="256"
            x="288"
            y="224"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            rx="8"
            ry="8"
          />
          <rect
            width="48"
            height="368"
            x="400"
            y="112"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            rx="8"
            ry="8"
          />
          <rect
            width="48"
            height="448"
            x="176"
            y="32"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            rx="8"
            ry="8"
          />
        </svg>
        <span className="btm-nav-label text-xs">Statics</span>
      </Link>
      <Link href="/create-workout/create">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="btm-nav-label text-xs">Create Workout</span>
      </Link>
    </div>
  );
};
