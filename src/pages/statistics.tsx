import { addDays } from "date-fns";
import dayjs from "dayjs";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/datepickerRange";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PageHead } from "../components/Head";
import { PageTitle } from "../components/PageTitle";
import PageTransition from "../components/PageTransition";
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
				<AccordionTrigger className="text-sm font-medium">
					Session reps
				</AccordionTrigger>
				<AccordionContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead></TableHead>
								<TableHead>Kg</TableHead>
								<TableHead>Seconds</TableHead>
								<TableHead>Reps</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{doneReps?.map((rep, index) => (
								<TableRow key={rep.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{rep?.weightAmount}</TableCell>
									<TableCell>{rep?.secoundsAmount}</TableCell>
									<TableCell>{rep?.repsAmount}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

const Tabs = ({
	showDoneSessions,
	setShowDoneSessions,
}: {
	showDoneSessions: boolean;
	setShowDoneSessions: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<div className="flex items-center justify-between pt-2">
			<Label htmlFor="show-done-sessions" className="cursor-pointer">
				Show done sessions
			</Label>
			<Switch
				id="show-done-sessions"
				checked={showDoneSessions}
				onCheckedChange={() => setShowDoneSessions(!showDoneSessions)}
			/>
		</div>
	);
};

export type SessionProps = WorkoutSession & { workout: Workout; reps: Rep[] };

export const SessionCard = ({ session }: { session: SessionProps }) => {
	const { workout, reps, done, doneAt, id } = session;
	const doneReps = reps?.filter(({ done: repDone }) => repDone);

	/* const handleSessionkDone = trpc.workoutSession.markSessionDone.useMutation();

  const handleDone = () => {
    handleSessionkDone.mutate({
      id,
      done: false,
    });
    refetch();
  }; */

	return (
		<div className="p- rounded-md border border-slate-800 p-3">
			<div className="flex items-center gap-4 ">
				<Checkbox defaultChecked disabled />
				<div>
					<p className="text-mase font-medium">{workout.title}</p>
					<span className="text-sm text-slate-400">
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

	return (
		<div className="grid gap-4 pt-3">
			{sessionData?.map((session) => (
				<SessionCard key={session.id} session={session} />
			))}
		</div>
	);
};

type PageProps = {};
const Statistics = (
	props: PageProps,
	ref: React.ForwardedRef<HTMLDivElement>,
) => {
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
		<PageTransition ref={ref}>
			<PageHead title="Statistics" />
			{isLoading ? (
				<div>Fetching workouts...</div>
			) : (
				<div className="mb-20">
					<div className="mb-4">
						<PageTitle title="Number of sessions per workout" />
					</div>
					<div className="mb-3">
						<Tabs
							showDoneSessions={showDoneSessions}
							setShowDoneSessions={setShowDoneSessions}
						/>
					</div>
					{showDoneSessions ? (
						<DoneSessions />
					) : (
						<>
							<DatePickerWithRange date={date} setDate={setDate} />
							<div className="pt-5">
								<SessionsTable sessionData={data as WorkoutSessionData[]} />
							</div>
						</>
					)}
				</div>
			)}
		</PageTransition>
	);
};

export default Statistics;
