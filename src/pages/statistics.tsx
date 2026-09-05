import { addDays } from "date-fns";
import dayjs from "dayjs";
import { BarChart3, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { DateRange } from "@/components/ui/calendar";
import { DatePickerWithRange } from "@/components/ui/datepickerRange";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PageHead } from "../components/Head";
import {
	SessionsTable,
	type WorkoutSessionData,
} from "../components/SessionsTable";
import type { Rep, Workout, WorkoutSession } from "../types/models";
import { trpc } from "../utils/trpc";

export const DoneRepsTable = ({ doneReps }: { doneReps: Rep[] }) => {
	if (!doneReps || doneReps?.length <= 0) {
		return null;
	}
	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="session-reps" className="border-none">
				<AccordionTrigger className="py-2 text-xs font-medium text-white/50 hover:text-white hover:no-underline">
					Session reps
				</AccordionTrigger>
				<AccordionContent>
					<div className="overflow-hidden rounded-lg border border-white/10">
						<Table>
							<TableHeader>
								<TableRow className="border-white/10 hover:bg-transparent">
									<TableHead className="h-8 w-8">#</TableHead>
									<TableHead className="h-8">Kg</TableHead>
									<TableHead className="h-8">Seconds</TableHead>
									<TableHead className="h-8">Reps</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{doneReps?.map((rep, index) => (
									<TableRow
										key={rep.id}
										className="border-white/5 hover:bg-white/5"
									>
										<TableCell className="text-white/40">{index + 1}</TableCell>
										<TableCell className="tabular-nums">
											{rep?.weightAmount}
										</TableCell>
										<TableCell className="tabular-nums">
											{rep?.secoundsAmount}
										</TableCell>
										<TableCell className="tabular-nums">
											{rep?.repsAmount}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

const ViewToggle = ({
	showDoneSessions,
	setShowDoneSessions,
}: {
	showDoneSessions: boolean;
	setShowDoneSessions: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const options = [
		{ label: "Per workout", active: !showDoneSessions, value: false },
		{ label: "Done sessions", active: showDoneSessions, value: true },
	];
	return (
		<div className="inline-flex w-full rounded-xl border border-white/10 bg-white/5 p-1">
			{options.map((option) => (
				<button
					key={option.label}
					type="button"
					onClick={() => setShowDoneSessions(option.value)}
					className={cn(
						"flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
						option.active
							? "bg-primary text-primary-foreground shadow-sm"
							: "text-white/50 hover:text-white",
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
};

export type SessionProps = WorkoutSession & { workout: Workout; reps: Rep[] };

export const SessionCard = ({ session }: { session: SessionProps }) => {
	const { workout, reps, doneAt } = session;
	const doneReps = reps?.filter(({ done: repDone }) => repDone);

	return (
		<div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-primary/30">
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
					<CheckCircle2 className="h-4 w-4 text-primary" />
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium text-white">
						{workout.title}
					</p>
					<span className="text-xs text-white/40">
						{dayjs(doneAt).format("DD.MM.YYYY")}
					</span>
				</div>
			</div>
			<DoneRepsTable doneReps={doneReps} />
		</div>
	);
};

const DoneSessions = () => {
	const { data: sessionData, isLoading: sessionsLoading } =
		trpc.workoutSession.allDoneSessions.useQuery();

	if (sessionsLoading) {
		return (
			<div className="flex justify-center py-16">
				<Loader2 className="h-5 w-5 animate-spin text-primary" />
			</div>
		);
	}

	if (!sessionData || sessionData.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
				<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
					<CalendarCheck className="h-5 w-5 text-white/30" />
				</div>
				<p className="text-sm font-medium text-white/70">
					No completed sessions yet
				</p>
				<p className="mt-1 text-xs text-white/40">
					Finished sessions will show up here.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-3">
			{sessionData.map((session) => (
				<SessionCard key={session.id} session={session} />
			))}
		</div>
	);
};

type PageProps = {};
const Statistics = (props: PageProps) => {
	const [showDoneSessions, setShowDoneSessions] = useState(false);
	const [date, setDate] = useState<DateRange | undefined>({
		from: new Date(),
		to: addDays(new Date(), 20),
	});

	const { data, isLoading } = trpc.workout.sessionCountsPerWorkout.useQuery({
		startDate: date?.from || null,
		endDate: date?.to || null,
	});

	return (
		<>
			<PageHead title="Statistics" />
			<div className="mx-auto w-full max-w-2xl pb-24">
				<div className="mb-6 flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
						<BarChart3 className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
							Statistics
						</h1>
						<p className="text-xs text-white/40 sm:text-sm">
							Track your sessions and progress
						</p>
					</div>
				</div>

				<div className="mb-5">
					<ViewToggle
						showDoneSessions={showDoneSessions}
						setShowDoneSessions={setShowDoneSessions}
					/>
				</div>

				{showDoneSessions ? (
					<DoneSessions />
				) : (
					<div className="flex flex-col gap-4">
						<DatePickerWithRange date={date} setDate={setDate} />
						{isLoading ? (
							<div className="flex justify-center py-16">
								<Loader2 className="h-5 w-5 animate-spin text-primary" />
							</div>
						) : (
							<SessionsTable sessionData={data as WorkoutSessionData[]} />
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Statistics;
