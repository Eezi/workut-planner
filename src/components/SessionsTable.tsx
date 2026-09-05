import dayjs from "dayjs";
import { CalendarDays, Dumbbell } from "lucide-react";
import type { WorkoutSession } from "../types/models";
import { sliceLongText } from "../utils/sliceLongText";

export interface WorkoutSessionData {
	title: string;
	id: string;
	count: number;
	latestSession: WorkoutSession;
}

export const SessionsTable = ({
	sessionData,
}: {
	sessionData: WorkoutSessionData[];
}) => {
	if (!sessionData || sessionData.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
				<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
					<Dumbbell className="h-5 w-5 text-white/30" />
				</div>
				<p className="text-sm font-medium text-white/70">No sessions found</p>
				<p className="mt-1 text-xs text-white/40">
					Try adjusting the selected date range.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2.5">
			{sessionData.map(({ title, id, count, latestSession }) => (
				<div
					key={id}
					className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-primary/30 hover:bg-white/[0.07]"
				>
					<div className="flex min-w-0 items-center gap-3">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
							<Dumbbell className="h-4 w-4 text-primary" />
						</div>
						<div className="min-w-0">
							<p className="truncate text-sm font-medium text-white">
								{sliceLongText(title)}
							</p>
							<p className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
								<CalendarDays className="h-3 w-3" />
								{dayjs(latestSession?.date).format("DD.MM.YYYY")}
							</p>
						</div>
					</div>
					<div className="flex flex-col items-end leading-none">
						<span className="text-lg font-semibold tabular-nums text-primary">
							{count}
						</span>
						<span className="mt-1 text-[10px] uppercase tracking-wide text-white/30">
							{count === 1 ? "session" : "sessions"}
						</span>
					</div>
				</div>
			))}
		</div>
	);
};
