import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const LoggedInNav = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  return (
  <>
      <div className="invisible md:visible flex md:gap-7 gap-0 font-semibold">
        <Link href="/workout-sessions">Sessions</Link>
        <Link href="/allworkouts">Workouts</Link>
        <Link  
        href={{
          pathname: '/create-workout/[slug]',
          query: { slug: 'create' },
        }} 
        >Create Workout</Link>
      </div>
      <div className="dropdown-end dropdown">
        <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
          <div className="w-10 rounded-full">
            <img alt="user-image" src={sessionData?.user?.image || ''} />
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
    <div data-theme="forest" className="navbar">
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
  if (!sessionData) return null;
  return (
    <div data-theme="forest" className="btm-nav fixed bottom-0 md:invisible">
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
      <Link href="/allworkouts" className="active">

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
      <Link href="/create-workout">

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
