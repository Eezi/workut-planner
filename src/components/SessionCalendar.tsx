import dayjs, { type Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "../types/Session";
import { trpc } from "../utils/trpc";
import { ReusableAlertDialog } from "./AddSessionModal";
import { Button } from "./ui/button";
import { AddSessionModalContent, intensityColors } from "./workoutCard";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const LEGEND = [
	{ label: "Easy", intensity: "EASY" },
	{ label: "Medium", intensity: "MEDIUM" },
	{ label: "Hard", intensity: "HARD" },
];

const MAX_DOTS = 3;

export const SessionCalendar = ({ sessions }: { sessions?: Session[] }) => {
	const [month, setMonth] = useState<Dayjs>(() => dayjs().startOf("month"));
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState<Date>(new Date());
	const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");

	const { data: sessionData, status } = useSession();
	const { data: workouts, isLoading } = trpc.workout.getAllWorkouts.useQuery(
		undefined,
		{ enabled: status === "authenticated" },
	);

	useEffect(() => {
		if (workouts && workouts.length > 0 && !isLoading) {
			setSelectedWorkoutId(workouts?.[0]?.id || "");
		}
	}, [workouts, isLoading]);

	const utils = trpc.useContext();
	const postWorkoutSession = trpc.workoutSession.postWorkoutSession.useMutation(
		{
			onSettled: () => {
				utils.workoutSession.getAllWorkoutSessions.invalidate();
			},
		},
	);

	const sessionsByDay = useMemo(() => {
		const grouped = new Map<string, Session[]>();
		sessions?.forEach((session) => {
			const key = dayjs(session.date).format("YYYY-MM-DD");
			const existing = grouped.get(key);
			if (existing) {
				existing.push(session);
			} else {
				grouped.set(key, [session]);
			}
		});
		return grouped;
	}, [sessions]);

	const monthSessionCount = useMemo(
		() =>
			sessions?.filter((session) => dayjs(session.date).isSame(month, "month"))
				.length ?? 0,
		[sessions, month],
	);

	const daysInMonth = month.daysInMonth();
	// dayjs weeks start on Sunday, shift so the grid starts on Monday
	const leadingBlanks = (month.day() + 6) % 7;
	const days = Array.from({ length: daysInMonth }, (_, i) => month.date(i + 1));

	const canAddSessions =
		Boolean(sessionData?.user) && Boolean(workouts && workouts.length > 0);

	const handleDayClick = (day: Dayjs) => {
		if (!canAddSessions) return;
		setDate(day.hour(12).minute(0).second(0).toDate());
		setOpen(true);
	};

	const handleSubmit = () => {
		if (!selectedWorkoutId || !sessionData?.user) return;
		postWorkoutSession.mutate({
			workoutId: selectedWorkoutId,
			userId: sessionData.user.id as string,
			date: date,
			done: false,
		});
		setOpen(false);
	};

	return (
		<div className="flex flex-col gap-4">
			<ReusableAlertDialog
				title="Select day and workout for session"
				description=""
				cancelText="Cancel"
				actionText="Create"
				onConfirm={handleSubmit}
				open={open}
				onCancel={() => setOpen(false)}
			>
				<AddSessionModalContent
					workouts={workouts}
					setDate={setDate}
					date={date}
					setSelectedWorkoutId={setSelectedWorkoutId}
					selectedWorkoutId={selectedWorkoutId}
				/>
			</ReusableAlertDialog>

			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-white">
					{month.format("MMMM, YYYY")}
				</h2>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						aria-label="Previous month"
						onClick={() => setMonth((prev) => prev.subtract(1, "month"))}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						aria-label="Next month"
						onClick={() => setMonth((prev) => prev.add(1, "month"))}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-4">
					{LEGEND.map(({ label, intensity }) => (
						<div key={intensity} className="flex items-center gap-1.5">
							<span
								className="h-2 w-2 rounded-full"
								style={{ backgroundColor: intensityColors.get(intensity) }}
							/>
							<span className="text-xs text-slate-400">{label}</span>
						</div>
					))}
				</div>
				<span className="text-xs text-slate-400">
					Sessions: <span className="text-white">{monthSessionCount}</span>
				</span>
			</div>

			<div className="grid grid-cols-7 gap-1.5">
				{WEEKDAYS.map((weekday) => (
					<div
						key={weekday}
						className="flex items-center justify-center rounded-lg bg-white/5 py-2 text-[11px] font-medium tracking-wide text-slate-400"
					>
						{weekday}
					</div>
				))}

				{Array.from({ length: leadingBlanks }, (_, i) => (
					<div
						key={`blank-${month
							.subtract(leadingBlanks - i, "day")
							.format("YYYY-MM-DD")}`}
					/>
				))}

				{days.map((day) => {
					const daySessions = sessionsByDay.get(day.format("YYYY-MM-DD")) ?? [];
					const isToday = day.isSame(dayjs(), "day");
					const overflow = daySessions.length - MAX_DOTS;

					return (
						<button
							key={day.format("YYYY-MM-DD")}
							type="button"
							onClick={() => handleDayClick(day)}
							aria-label={`Add session on ${day.format("DD.MM.YYYY")}`}
							className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl bg-white/5 transition-colors hover:bg-white/15 ${
								isToday ? "ring-1 ring-white/60" : ""
							}`}
						>
							<span
								className={`text-sm ${
									isToday ? "font-semibold text-white" : "text-slate-200"
								}`}
							>
								{day.date()}
							</span>
							<div className="flex h-1.5 items-center gap-1">
								{daySessions.slice(0, MAX_DOTS).map((session) => (
									<span
										key={session.id}
										className="h-1.5 w-1.5 rounded-full"
										style={{
											backgroundColor:
												intensityColors.get(session.workout?.intensity ?? "") ??
												"#6b7280",
											opacity: session.done ? 0.4 : 1,
										}}
									/>
								))}
								{overflow > 0 && (
									<span className="text-[9px] leading-none text-slate-400">
										+{overflow}
									</span>
								)}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};
