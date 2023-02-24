import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const LoggedInNav = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  return (
    <ul className="menu menu-horizontal px-1">
      <li className="font-semibold">
        <Link href="/allworkouts">Workouts</Link>
      </li>
      <li className="font-semibold">
        <Link href="/create-workout">Create Workout</Link>
      </li>
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10 rounded-full">
              <img alt="user-image" src={sessionData?.user?.image} />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a onClick={signOut}>Logout</a>
            </li>
          </ul>
        </div>
    </ul>
  );
};

export const Navbar = () => {
  return (
    <div className="navbar bg-neutral-focus ">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-xl normal-case">
          Workout App
        </Link>
      </div>
      <div className="flex-none">
        <LoggedInNav />
      </div>
    </div>
  );
};
