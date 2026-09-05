import dayjs from "dayjs";
import { CalendarDays, Dumbbell, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AddNotes } from "../../components/AddNotes";
import { DatePicker } from "../../components/Datepicker";
import { PageHead } from "../../components/Head";
import type { Rep, Workout } from "../../types/models";
import { trpc } from "../../utils/trpc";
import { DoneRepsTable } from "../statistics";

type Props = {
	rep: Rep | undefined;
	workout: Workout | undefined;
	repCount: number;
};

const RepField = ({
	label,
	name,
	value,
	disabled,
	onBlur,
	onChange,
}: {
	label: string;
	name: string;
	value: string;
	disabled?: boolean;
	onBlur: (value: string) => void;
	onChange: (value: string) => void;
}) => (
	<div className="flex min-w-[72px] flex-1 flex-col gap-1">
		<span className="text-[10px] font-medium uppercase tracking-wide text-white/40">
			{label}
		</span>
		<Input
			inputMode="numeric"
			name={name}
			value={value}
			disabled={disabled}
			onBlur={({ target }) => onBlur(target.value)}
			onChange={({ target }) => onChange(target.value)}
			className="h-9 tabular-nums"
		/>
	</div>
);

const RepCheckbox = (props: Props) => {
	const validateAmount = z.number().nonnegative();
	const { rep, workout, repCount } = props;
	const { id } = rep || {};

	const utils = trpc.useContext();
	const router = useRouter();
	const {
		query: { slug },
	} = router;

	const editRep = trpc.rep.editRep.useMutation({
		onMutate: async (newEntry: any) => {
			await utils.workoutSession.sessionById.cancel();
			utils.workoutSession.sessionById.setData(
				{ id: slug as string },
				(prevEntries: any) => {
					if (prevEntries && newEntry) {
						const newData = {
							...prevEntries,
							reps: prevEntries?.reps?.map((item: any) => {
								if (item.id === newEntry.id) {
									return newEntry;
								}
								return item;
							}),
						};
						return newData;
					}
				},
			);
		},
		onSettled: async () => {
			await utils.workoutSession.sessionById.invalidate();
		},
	});
	const removeRep = trpc.rep.removeRep.useMutation({
		onMutate: async (removedEntry: any) => {
			await utils.workoutSession.sessionById.cancel();
			utils.workoutSession.sessionById.setData(
				{ id: slug as string },
				(prevEntries: any) => {
					if (prevEntries && removedEntry) {
						return {
							...prevEntries,
							reps: prevEntries?.reps?.filter(
								(item: any) => item.id !== removedEntry.id,
							),
						};
					}
					return prevEntries;
				},
			);
		},
		onSettled: async () => {
			await utils.workoutSession.sessionById.invalidate();
		},
	});
	const [initialDataSetted, setInitialDataSetted] = useState(false);
	const [fields, setFields] = useState({
		secoundsAmount: "",
		weightAmount: "",
		repsAmount: "",
		done: false,
	});

	useEffect(() => {
		if (rep && !initialDataSetted) {
			const { secoundsAmount, weightAmount, repsAmount, done } = rep;
			setFields({
				weightAmount: weightAmount ? weightAmount.toString() : "",
				secoundsAmount: secoundsAmount ? secoundsAmount.toString() : "",
				repsAmount: repsAmount ? repsAmount.toString() : "",
				done,
			});
			setInitialDataSetted(true);
		}
	}, [rep, initialDataSetted]);

	const handleFieldValue = (value: string | boolean) => {
		if (value === "") return undefined;
		return Number(value);
	};

	const handleEditRep = (
		key: "done" | "secoundsAmount" | "weightAmount" | "repsAmount",
		value: string | boolean,
	) => {
		const updatedFields = {
			...fields,
			secoundsAmount: fields.secoundsAmount
				? Number(fields.secoundsAmount)
				: undefined,
			weightAmount: fields.weightAmount
				? Number(fields.weightAmount)
				: undefined,
			repsAmount: fields.repsAmount ? Number(fields.repsAmount) : undefined,
			[key]: key === "done" ? Boolean(value) : handleFieldValue(value),
		};

		Object.values(updatedFields).forEach((amount) =>
			validateAmount.safeParse(amount),
		);

		if (id) {
			editRep.mutate({
				id,
				...updatedFields,
			});
		}
	};

	const handleRemoveRep = async () => {
		if (id) {
			removeRep.mutate({
				id,
			});
		}
	};

	const { includeSeconds, includeWeight, includeReps } = workout || {};
	return (
		<div
			className={cn(
				"rounded-xl border p-3 transition-colors",
				fields.done
					? "border-primary/40 bg-primary/5"
					: "border-white/10 bg-white/5",
			)}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-xs font-medium tabular-nums text-white/50">
						{repCount}
					</span>
					<div className="flex items-center gap-2">
						<Checkbox
							checked={fields.done}
							disabled={!id}
							onCheckedChange={(newValue) => {
								setFields({ ...fields, done: newValue as boolean });
								handleEditRep("done", newValue);
							}}
						/>
						<span className="text-xs font-medium text-white/60">Done</span>
					</div>
				</div>
				<button
					type="button"
					aria-label="Remove rep"
					onClick={handleRemoveRep}
					disabled={!id}
					className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:border-red-500/40 hover:text-red-400 disabled:opacity-40"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
			{(includeWeight || includeSeconds || includeReps) && (
				<div className="mt-3 flex flex-wrap gap-3">
					{includeWeight && (
						<RepField
							label="Kg"
							name="weightAmount"
							value={fields.weightAmount}
							disabled={!id}
							onBlur={(value) => handleEditRep("weightAmount", value)}
							onChange={(value) =>
								setFields({ ...fields, weightAmount: value })
							}
						/>
					)}
					{includeSeconds && (
						<RepField
							label="Seconds"
							name="secoundsAmount"
							value={fields.secoundsAmount}
							disabled={!id}
							onBlur={(value) => handleEditRep("secoundsAmount", value)}
							onChange={(value) =>
								setFields({ ...fields, secoundsAmount: value })
							}
						/>
					)}
					{includeReps && (
						<RepField
							label="Reps"
							name="repsAmount"
							value={fields.repsAmount}
							disabled={!id}
							onBlur={(value) => handleEditRep("repsAmount", value)}
							onChange={(value) => setFields({ ...fields, repsAmount: value })}
						/>
					)}
				</div>
			)}
		</div>
	);
};

const RepsList = ({
	reps,
	workout,
}: {
	reps: Rep[] | undefined;
	workout: Workout | undefined;
}) => {
	if (!reps || reps.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-8 text-center">
				<p className="text-sm font-medium text-white/70">No reps yet</p>
				<p className="mt-1 text-xs text-white/40">
					Add your first rep to start tracking this session.
				</p>
			</div>
		);
	}
	return (
		<div className="flex flex-col gap-2.5">
			{reps.map((rep, index) => (
				<RepCheckbox
					repCount={index + 1}
					key={rep.id}
					workout={workout}
					rep={rep}
				/>
			))}
		</div>
	);
};

type PageProps = {};
const SessionNotes = (props: PageProps) => {
	const router = useRouter();
	const {
		query: { slug },
	} = router;
	const {
		data: session,
		error,
		isLoading,
	} = trpc.workoutSession.sessionById.useQuery({
		id: slug as string,
	});
	const [sessionDate, setSessionDate] = useState<Date>(
		session?.date || new Date(),
	);
	const editSession = trpc.workoutSession.editSession.useMutation();
	const { data: latestSession } =
		trpc.workoutSession.fetchLatestDoneSession.useQuery({
			workoutId: session?.workoutId,
		});
	const utils = trpc.useContext();
	const createRep = trpc.rep.createRep.useMutation({
		onMutate: async (newEntry) => {
			await utils.workoutSession.sessionById.cancel();
			const optimisticRep: Rep = {
				id: `optimistic-${Date.now()}`,
				done: false,
				secoundsAmount: null,
				weightAmount: null,
				repsAmount: null,
				workoutSessionId: newEntry.workoutSessionId,
				workoutId: newEntry.workoutId,
			};
			utils.workoutSession.sessionById.setData(
				{ id: slug as string },
				(prevEntries: any) => {
					if (prevEntries) {
						return {
							...prevEntries,
							reps: [...(prevEntries.reps ?? []), optimisticRep],
						};
					}
					return prevEntries;
				},
			);
		},
		onSettled: async () => {
			await utils.workoutSession.sessionById.invalidate();
		},
	});
	const doneReps = latestSession?.reps?.filter(
		({ done: repDone }: Rep) => repDone,
	);

	const handleCreateRep = () => {
		if (session) {
			createRep.mutate({
				workoutSessionId: session.id,
				workoutId: session.workoutId,
			});
		}
	};

	const formattedText = useMemo(() => {
		return session?.workout?.description?.split("\n").join("<br />");
	}, [session?.workout?.description]);

	const handleUpdateDate = (newDate: Date) => {
		setSessionDate(new Date(newDate));
		if (session?.id) {
			editSession.mutate({
				id: session?.id,
				date: new Date(newDate),
			});
		}
	};

	return (
		<>
			<PageHead title="Session" />
			<div className="mx-auto w-full max-w-2xl pb-24">
				{isLoading ? (
					<div className="flex justify-center py-16">
						<Loader2 className="h-5 w-5 animate-spin text-primary" />
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
						<p className="text-sm font-medium text-red-300">
							Something went wrong
						</p>
						<p className="mt-1 text-xs text-white/40">
							We couldn&apos;t load this session. Try again later.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-6">
						<div className="flex items-start gap-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
								<Dumbbell className="h-5 w-5 text-primary" />
							</div>
							<div className="min-w-0 flex-1">
								<h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
									{session?.workout?.title}
								</h1>
								{latestSession && (
									<p className="mt-1 flex items-center gap-1.5 text-xs text-white/40 sm:text-sm">
										<CalendarDays className="h-3.5 w-3.5" />
										Last done{" "}
										{dayjs(latestSession?.doneAt).format("DD.MM.YYYY")}
									</p>
								)}
							</div>
						</div>

						{doneReps && doneReps.length > 0 && (
							<div className="rounded-xl border border-white/10 bg-white/5 px-3">
								<DoneRepsTable doneReps={doneReps as Rep[]} />
							</div>
						)}

						{formattedText && (
							<div
								className="max-w-[55ch] whitespace-pre-line rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/70"
								dangerouslySetInnerHTML={{ __html: formattedText as string }}
							/>
						)}

						<div className="flex flex-col gap-2">
							<span className="text-xs font-medium uppercase tracking-wide text-white/40">
								Session date
							</span>
							<DatePicker date={sessionDate} setDate={handleUpdateDate} />
						</div>

						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<h2 className="text-base font-semibold text-white">Reps</h2>
								<Button
									variant="outline"
									size="sm"
									onClick={handleCreateRep}
									className="gap-1.5"
								>
									<Plus className="h-4 w-4" />
									Add rep
								</Button>
							</div>
							<RepsList reps={session?.reps} workout={session?.workout} />
						</div>

						<div className="flex flex-col gap-2">
							<span className="text-xs font-medium uppercase tracking-wide text-white/40">
								Notes
							</span>
							<AddNotes
								workoutId={session?.workoutId as string}
								workoutSessionId={session?.id as string}
							/>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default SessionNotes;
