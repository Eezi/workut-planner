import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { ReusableAlertDialog } from "./AddSessionModal";
import { Button } from "./ui/button";
import { AddSessionModalContent } from "./workoutCard";

export const AddSessionButton = () => {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState<Date>(new Date());
	const { data: sessionData, status } = useSession();
	const { data: workouts, isLoading } = trpc.workout.getAllWorkouts.useQuery(
		undefined,
		{ enabled: status === "authenticated" },
	);
	const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");
	useEffect(() => {
		if (workouts && workouts?.length > 0 && !isLoading) {
			setSelectedWorkoutId(workouts?.[0]?.id || "");
		}
	}, [workouts, isLoading]);
	const utils = trpc.useContext();
	const postWorkoutSession = trpc.workoutSession.postWorkoutSession.useMutation(
		{
			onMutate: () => {
				utils.workoutSession.getAllWorkoutSessions.cancel();
				const optimisticUpdate =
					utils.workoutSession.getAllWorkoutSessions.getData();

				if (optimisticUpdate) {
					utils.workoutSession.getAllWorkoutSessions.setData(
						undefined,
						optimisticUpdate,
					);
				}
			},
			onSettled: () => {
				utils.workoutSession.getAllWorkoutSessions.invalidate();
			},
		},
	);

	const handleSubmit = () => {
		if (!selectedWorkoutId || !sessionData?.user) return;
		postWorkoutSession.mutate({
			workoutId: selectedWorkoutId,
			userId: sessionData?.user?.id as string,
			date: date,
			done: false,
		});
		setOpen(false);
	};
	if (!sessionData) return null;
	if (!workouts || workouts?.length <= 0) {
		return null;
	}

	return (
		<>
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

			<div>
				<Button
					variant="outline"
					size="icon"
					onClick={() => setOpen(true)}
					className="h-8 w-8"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						viewBox="0 0 512 512"
					>
						<path
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="32"
							d="M256 112v288m144-144H112"
						/>
					</svg>
				</Button>
			</div>
		</>
	);
};
