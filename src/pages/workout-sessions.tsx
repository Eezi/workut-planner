import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHead } from "../components/Head";
import { PageTitle } from "../components/PageTitle";
import { intensityColors } from "../components/workoutCard";
import type { Session } from "../types/Session";
import { sliceLongText } from "../utils/sliceLongText";
import { trpc } from "../utils/trpc";

const ActionList = ({
	handleRemove,
	sessionId,
	removeIsPending,
}: {
	handleRemove: () => void;
	sessionId: string;
	removeIsPending: boolean;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button type="button" aria-label="Session actions">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="27"
						height="27"
						viewBox="0 0 512 512"
					>
						<path
							d="M136 216c-22.002 0-40 17.998-40 40s17.998 40 40 40 40-17.998 40-40-17.998-40-40-40zm240 0c-22.002 0-40 17.998-40 40s17.998 40 40 40 40-17.998 40-40-17.998-40-40-40zm-120 0c-22.002 0-40 17.998-40 40s17.998 40 40 40 40-17.998 40-40-17.998-40-40-40z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-52">
				<DropdownMenuItem asChild>
					<Link
						href={{
							pathname: "/session-view/[slug]",
							query: { slug: sessionId },
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 512 512"
						>
							<path
								fill="none"
								stroke="currentColor"
								strokeMiterlimit="10"
								strokeWidth="32"
								d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"
							/>
							<path
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeMiterlimit="10"
								strokeWidth="32"
								d="M338.29 338.29L448 448"
							/>
						</svg>
						Details
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={(event) => {
						event.preventDefault();
						handleRemove();
					}}
				>
					{removeIsPending ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
						>
							<g fill="currentColor">
								<path
									fillRule="evenodd"
									d="M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2h-3Zm-2-1H9v1h6V4Zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7Z"
									clipRule="evenodd"
								/>
								<path d="M9 9h2v8H9V9Zm4 0h2v8h-2V9Z" />
							</g>
						</svg>
					)}
					Remove
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const SessionCard = ({
	id,
	done,
	workout,
	date,
	noDateSection,
	animationsReady,
}: Session & { noDateSection?: boolean; animationsReady?: boolean }) => {
	const utils = trpc.useContext();

	const handleSessionkDone = trpc.workoutSession.markSessionDone.useMutation({
		onMutate: async (newEntry: any) => {
			await utils.workoutSession.getAllWorkoutSessions.cancel();
			utils.workoutSession.getAllWorkoutSessions.setData(
				undefined,
				(prevEntries: any) => {
					if (prevEntries && newEntry) {
						return prevEntries.map((item: Session) => {
							if (item.id === newEntry.id) {
								return {
									...item,
									done: newEntry.done,
								};
							}
							return item;
						});
					}
				},
			);
		},
		onSettled: async () => {
			await utils.workoutSession.getAllWorkoutSessions.invalidate();
		},
	});

	const removeSession = trpc.workoutSession.removeSession.useMutation({
		onMutate: async (newEntry: any) => {
			await utils.workoutSession.getAllWorkoutSessions.cancel();
			utils.workoutSession.getAllWorkoutSessions.setData(
				undefined,
				(prevEntries: any) => {
					if (prevEntries) {
						return prevEntries.filter(({ id }: Session) => id !== newEntry.id);
					}
				},
			);
		},
		onSettled: async () => {
			await utils.workoutSession.getAllWorkoutSessions.invalidate();
		},
	});

	const handleMarkDone = (sessionId: string, checked: boolean) => {
		handleSessionkDone.mutate({
			id: sessionId,
			done: checked,
		});
	};

	const handleRemove = () => {
		removeSession.mutate({
			id,
		});
	};

	const accent = intensityColors.get(workout?.intensity ?? "") ?? "#6b7280";

	return (
		<motion.div
			key={id}
			layout={animationsReady}
			initial={animationsReady ? { opacity: 0, y: -12, scale: 0.96 } : false}
			animate={{ opacity: done ? 0.55 : 1, y: 0, scale: 1 }}
			exit={{
				opacity: 0,
				x: -48,
				scale: 0.9,
				height: 0,
				paddingTop: 0,
				paddingBottom: 0,
			}}
			transition={{ duration: 0.25, ease: "easeOut" }}
			className="flex items-center gap-4 overflow-hidden py-1.5"
		>
			<Checkbox
				checked={done}
				onCheckedChange={(newValue) => handleMarkDone(id, newValue as boolean)}
				className="h-6 w-6 shrink-0 rounded-md border-2 shadow-none"
				style={{
					borderColor: accent,
					backgroundColor: done ? accent : `${accent}26`,
					color: "#09090b",
				}}
			/>

			<div className="flex min-w-0 grow items-center justify-between gap-3">
				<div className="min-w-0">
					<Link
						className="text-lg font-normal text-white"
						href={{
							pathname: "/session-view/[slug]",
							query: { slug: id },
						}}
					>
						{sliceLongText(workout?.title)}
					</Link>
					{noDateSection && (
						<p className="text-xs font-normal text-slate-400">
							{dayjs(date).format("DD.MM.")}
						</p>
					)}
				</div>
				<ActionList
					handleRemove={handleRemove}
					removeIsPending={removeSession.isLoading}
					sessionId={id}
				/>
			</div>
		</motion.div>
	);
};

const late = "Late";
const upcoming = "Upcoming";

type GroupedData = {
	[key: string]: Session[];
};

const SessionCardContainer = ({
	nextSevenDaysSessions,
}: {
	nextSevenDaysSessions: GroupedData;
}) => {
	const [animationsReady, setAnimationsReady] = useState(false);
	useEffect(() => {
		const raf = requestAnimationFrame(() => setAnimationsReady(true));
		return () => cancelAnimationFrame(raf);
	}, []);

	const groupedSessions = Object.keys(nextSevenDaysSessions);
	const getDayLabel = (dateKey: string) => {
		const day = dayjs(dateKey);
		if (day.isSame(dayjs(), "day")) return "Today";
		if (day.isSame(dayjs().add(1, "day"), "day")) return "Tomorrow";
		return day.format("dddd");
	};
	const showLateOrUpcomingHeader = (
		groupKey: keyof typeof nextSevenDaysSessions,
	) => {
		if (nextSevenDaysSessions) {
			const group = nextSevenDaysSessions[groupKey];
			if ((groupKey === late || groupKey === upcoming) && group) {
				return group.length > 0;
			}
		}
		return false;
	};
	return (
		<>
			{groupedSessions?.map((dayKey) => (
				<div key={dayKey}>
					{showLateOrUpcomingHeader(dayKey) ? (
						<>
							<div className="mb-3 flex items-center gap-3">
								<span className="text-lg font-medium text-white/50">
									{dayKey}
								</span>
								<div className="h-px grow bg-white/10" />
							</div>
							<div className="flex flex-col">
								<AnimatePresence mode="popLayout" initial={false}>
									{nextSevenDaysSessions[dayKey]?.map((session) => (
										<SessionCard
											noDateSection
											key={session.id}
											{...session}
											animationsReady={animationsReady}
										/>
									))}
								</AnimatePresence>
							</div>
						</>
					) : (
						<>
							<div className="mb-3 flex items-center gap-3">
								<span className="text-3xl font-bold text-white">
									{dayjs(dayKey).format("D")}
								</span>
								<span className="text-lg font-medium text-white/50">
									{getDayLabel(dayKey)}
								</span>
								<div className="h-px grow bg-white/10" />
							</div>
							<div className="flex flex-col">
								<AnimatePresence mode="popLayout" initial={false}>
									{nextSevenDaysSessions[dayKey]?.map((session) => (
										<SessionCard
											key={session.id}
											{...session}
											animationsReady={animationsReady}
										/>
									))}
								</AnimatePresence>
							</div>
						</>
					)}
				</div>
			))}
		</>
	);
};

type PageProps = {};
const WorkoutSessions: NextPage = (props: PageProps) => {
	const { status } = useSession();
	const { data: sessions, isLoading } =
		trpc.workoutSession.getAllWorkoutSessions.useQuery(undefined, {
			enabled: status === "authenticated",
		});

	const groupByNextSevenDays = (sessions: any): GroupedData => {
		const sevenDays = Array.from({ length: 7 }, (_, i) =>
			dayjs().add(i, "day").format("YYYY-MM-DD"),
		);
		const nextSevenDays = [late, ...sevenDays, upcoming];

		const acc: GroupedData = nextSevenDays.reduce<GroupedData>((acc, date) => {
			acc[date] = [];
			return acc;
		}, {});

		sessions?.forEach((item: any) => {
			const date = dayjs(item.date).format("YYYY-MM-DD");
			const sessionIsPast = dayjs(item.date).isBefore(dayjs(), "day");
			if (sessionIsPast) {
				return acc[late]?.push(item);
			}
			const upcomingDate = sevenDays[sevenDays.length - 1];
			const sessionIsFarInFuture = dayjs(item.date).isAfter(
				upcomingDate,
				"day",
			);

			if (sessionIsFarInFuture) {
				return acc[upcoming]?.push(item);
			}

			if (acc[date]) {
				acc[date]?.push(item);
			}
		});

		if (acc[late] && acc[late].length <= 0) {
			delete acc[late];
		}
		if (acc[upcoming] && acc[upcoming].length <= 0) {
			delete acc[upcoming];
		}

		return acc;
	};

	const nextSevenDaysSessions = groupByNextSevenDays(sessions);

	return (
		<>
			<PageHead title="Sessions" />
			{isLoading ? (
				<div>Fetching sessions...</div>
			) : (
				<div
					/*style={{
            width: "100vw",
            position: "absolute",
            left: -20,
            }} */
					className="border-1 flex flex-col gap-6 "
				>
					<PageTitle title="Upcoming sessions" />
					<div className="mb-16 flex flex-col gap-10">
						<SessionCardContainer
							nextSevenDaysSessions={nextSevenDaysSessions}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default WorkoutSessions;
