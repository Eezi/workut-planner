import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AddSessionButton } from "./AddSessionButton";

const pages = [
  {
    link: "/statistics",
    name: "Statics",
    icon: (
      <svg
        className="h-4 w-4"
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
    ),
  },
  {
    link: "/workout-sessions",
    name: "Sessions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
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
    ),
  },
  {
    link: "/allworkouts",
    name: "Workouts",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
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
    ),
  },
];

const LoggedInNav = () => {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  return (
    <>
      <div className="ml-auto hidden gap-0 font-semibold md:flex md:gap-7">
        {pages.map(({ link, name }) => {
          const isActive = pathname === link;
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
        <AddSessionButton />
      </div>
      <div className="dropdown-end dropdown ml-4">
        <label tabIndex={0} className="btn-ghost btn btn-circle avatar">
          <div className="w-8 rounded-full">
            <img alt="user-image" src={sessionData?.user?.image || ""} />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu-compact dropdown-content menu z-10 mt-3 w-52 rounded-box bg-slate-700 p-2 shadow"
        >
          <li className="font-semibold">
            <a onClick={() => signOut()}>Logout</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export const Navbar = () => {
  return (
    <div className="navbar flex-row-reverse px-0">
      <LoggedInNav />
    </div>
  );
};

export const BottomNavBar = () => {
  const { data: sessionData } = useSession();
  const pathname = usePathname();
  if (!sessionData) return null;

  return (
    <>
      <div
        style={{
          boxShadow: "7px 55px 126px -46px rgba(29,36,46,1)",
          borderBottom: "1px solid #080b0e",
          borderRight: "1px solid #080b0e",
          borderLeft: "1px solid #080b0e",
        }}
        className="late-700 btm-nav fixed bottom-0 h-20 rounded-xl border-t px-1 pt-2 pb-5 md:hidden"
      >
        {pages.map(({ name, link, icon }) => {
          const isActive = pathname === link;
          return (
            <Link
              key={link}
              className={isActive ? "text-primary" : "text-slate-300"}
              href={link}
            >
              {icon}
              <span className="btm-nav-label text-xs">{name}</span>
            </Link>
          );
        })}
        <AddSessionButton />
      </div>
    </>
  );
};
