import { Repeat, Timer, Weight } from "lucide-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHead } from "../../components/Head";
import { PageTitle } from "../../components/PageTitle";
import { trpc } from "../../utils/trpc";

const CREATE_MODE = "create";

const INTENSITY_OPTIONS = [
	{
		value: "EASY",
		label: "Easy",
		activeClass: "border-blue-500 bg-blue-500/10 text-blue-400",
	},
	{
		value: "MEDIUM",
		label: "Medium",
		activeClass: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
	},
	{
		value: "HARD",
		label: "Hard",
		activeClass: "border-red-500 bg-red-500/10 text-red-400",
	},
] as const;

const UNIT_OPTIONS = [
	{ key: "includeSeconds" as const, label: "Seconds", icon: Timer },
	{ key: "includeWeight" as const, label: "Weight (kg)", icon: Weight },
	{ key: "includeReps" as const, label: "Reps", icon: Repeat },
];

type UnitState = {
	includeSeconds: boolean;
	includeWeight: boolean;
	includeReps: boolean;
};

const FormSection = ({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) => (
	<div className="flex flex-col gap-2">
		<Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
			{label}
		</Label>
		{children}
	</div>
);

type PageProps = {};
const CreateWorkout: NextPage = (props: PageProps) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [numberOfReps, setNumberOfReps] = useState("");
	const [units, setUnits] = useState<UnitState>({
		includeSeconds: true,
		includeWeight: true,
		includeReps: false,
	});
	const [intensity, setIntensity] = useState<string>("MEDIUM");
	const [errors, setErrors] = useState<{ title: string | null }>({
		title: null,
	});

	const router = useRouter();
	const utils = trpc.useContext();
	const {
		query: { slug },
	} = router;
	const isCreateForm = slug === CREATE_MODE;

	const { data: workout, isLoading } = trpc.workout.workoutById.useQuery(
		{ id: slug as string },
		{ enabled: !isCreateForm && !!slug },
	);

	useEffect(() => {
		if (!isLoading && workout) {
			const { title, description, intensity, reps } = workout;
			setTitle(title);
			setDescription(description || "");
			setIntensity(intensity);
			setNumberOfReps(reps ? reps.toString() : "");
		}
	}, [isLoading, workout]);

	const { data: sessionData } = useSession();

	const postWorkout = trpc.workout.postWorkout.useMutation({
		onMutate: () => utils.workout.getAllWorkouts.cancel(),
		onSettled: () => utils.workout.getAllWorkouts.invalidate(),
	});

	const editWorkout = trpc.workout.editWorkout.useMutation({
		onMutate: () => utils.workout.getAllWorkouts.cancel(),
		onSettled: () => utils.workout.getAllWorkouts.invalidate(),
	});

	const handleSubmit = async () => {
		if (!title) return setErrors({ title: "Workout title is required" });

		const payload = {
			title,
			description,
			reps: Number(numberOfReps),
			intensity,
			...units,
		};

		if (isCreateForm) {
			postWorkout.mutate({ ...payload, userId: sessionData?.user?.id || "" });
		} else if (workout) {
			editWorkout.mutate({ id: workout.id, ...payload });
		}

		setTitle("");
		setDescription("");
		router.push("/allworkouts");
	};

	const toggleUnit = (key: keyof UnitState) =>
		setUnits((prev) => ({ ...prev, [key]: !prev[key] }));

	return (
		<>
			<PageHead title="Create Workout" />
			<PageTitle title={isCreateForm ? "Create workout" : "Edit workout"} />

			<div className="mt-6 flex flex-col gap-6 pb-24">
				{/* Title */}
				<FormSection label="Workout name">
					<Input
						type="text"
						value={title}
						placeholder="e.g. Upper body strength"
						required
						minLength={2}
						maxLength={200}
						className={
							errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
						}
						onChange={(e) => {
							setTitle(e.target.value);
							setErrors({ title: null });
						}}
					/>
					{errors.title && (
						<p className="text-xs text-red-400">{errors.title}</p>
					)}
				</FormSection>

				{/* Intensity */}
				<FormSection label="Intensity">
					<div className="grid grid-cols-3 gap-2">
						{INTENSITY_OPTIONS.map(({ value, label, activeClass }) => (
							<button
								key={value}
								type="button"
								onClick={() => setIntensity(value)}
								className={`rounded-xl border py-2.5 text-sm font-medium transition-all ${
									intensity === value
										? activeClass
										: "border-border bg-background text-muted-foreground hover:bg-accent"
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</FormSection>

				{/* Reps */}
				<FormSection label="Number of sets">
					<Input
						type="number"
						value={numberOfReps}
						placeholder="e.g. 3"
						min={1}
						max={99}
						onChange={(e) => setNumberOfReps(e.target.value)}
					/>
				</FormSection>

				{/* Tracking units */}
				<FormSection label="Track per set">
					<div className="grid grid-cols-3 gap-2">
						{UNIT_OPTIONS.map(({ key, label, icon: Icon }) => {
							const active = units[key];
							return (
								<button
									key={key}
									type="button"
									onClick={() => toggleUnit(key)}
									className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all ${
										active
											? "border-primary bg-primary/10 text-primary"
											: "border-border bg-background text-muted-foreground hover:bg-accent"
									}`}
								>
									<Icon
										className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`}
									/>
									{label}
								</button>
							);
						})}
					</div>
				</FormSection>

				{/* Description */}
				<FormSection label="Description (optional)">
					<Textarea
						value={description}
						rows={3}
						placeholder="Notes, tips, or instructions..."
						onChange={(e) => setDescription(e.target.value)}
					/>
				</FormSection>

				<Button
					size="lg"
					className="w-full"
					onClick={handleSubmit}
					disabled={postWorkout.isLoading || editWorkout.isLoading}
				>
					{isCreateForm ? "Create workout" : "Save changes"}
				</Button>
			</div>
		</>
	);
};

export default CreateWorkout;
