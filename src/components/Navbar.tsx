import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
			<div className="ml-auto hidden gap-0 font-medium md:flex md:gap-7">
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
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="ml-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent"
					>
						<img
							className="h-8 w-8 rounded-full"
							alt="user-image"
							src={sessionData?.user?.image || ""}
						/>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="mt-3 w-52">
					<DropdownMenuItem className="font-semibold" onClick={() => signOut()}>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export const Navbar = () => {
	return (
		<div className="flex flex-row-reverse items-center px-0 py-2">
			<LoggedInNav />
		</div>
	);
};

export const BottomNavBar = () => {
	const { data: sessionData } = useSession();
	const pathname = usePathname();
	if (!sessionData) return null;

	return (
		<div
			style={{
				backgroundColor: "hsl(240 5% 4%)",
			}}
			className="bg-gray-950 fixed bottom-0 left-0 right-0 flex w-full items-center justify-around px-1 pt-3 pb-6 md:hidden"
		>
			{pages.map(({ name, link, icon }) => {
				const isActive = pathname === link;
				return (
					<Link
						key={link}
						className={`grid place-items-center ${
							isActive ? "text-slate-100" : "text-slate-400"
						}`}
						href={link}
					>
						{icon}
						<span className="text-xs">{name}</span>
					</Link>
				);
			})}
			<AddSessionButton />
		</div>
	);
};
