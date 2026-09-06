import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Workout } from "../types/workout";
import { sliceLongText } from "../utils/sliceLongText";
import { trpc } from "../utils/trpc";
import { Modal, ReusableAlertDialog } from "./AddSessionModal";
import { DatePicker } from "./Datepicker";
import { WorkoutModalContent } from "./Modal";

export const intensityColors = new Map([
	["HARD", "#ff4b3f"],
	["MEDIUM", "#ff9a14"],
	["EASY", "#5297ff"],
]);

const badgeColors = new Map([
	["HARD", "text-red-900"],
	["MEDIUM", "text-amber-900"],
	["EASY", "text-blue-900"],
]);

const bgs = new Map([
	["HARD", "bg-red-100"],
	["MEDIUM", "bg-amber-100"],
	["EASY", "bg-blue-100"],
]);

interface Props {
	intensity: string;
	isSmall?: boolean;
}

export const AddSessionModalContent = ({
	setDate,
	date,
	workouts,
	setSelectedWorkoutId,
	selectedWorkoutId,
}: {
	setDate: React.Dispatch<React.SetStateAction<Date>>;
	date: Date;
	workouts?: Workout[];
	setSelectedWorkoutId?: React.Dispatch<React.SetStateAction<string>>;
	selectedWorkoutId?: string;
}) => (
	<div>
		<div className="px-2">
			<DatePicker setDate={setDate} date={date} />
			{workouts && (
				<div className="mt-6">
					<Select
						defaultValue={selectedWorkoutId}
						onValueChange={(value) => {
							if (typeof setSelectedWorkoutId === "function") {
								setSelectedWorkoutId(value);
							}
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select workout" />
						</SelectTrigger>
						<SelectContent>
							{workouts?.map(({ title, id }) => (
								<SelectItem key={id} value={id}>
									{title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
		</div>
	</div>
);

export const IntesityBadge = ({ intensity, isSmall }: Props) => (
	<>
		{isSmall ? (
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="25"
					height="25"
					viewBox="0 0 24 24"
				>
					<path
						fill={intensityColors.get(intensity)}
						fillRule="evenodd"
						d="m6 15.235l6 3.333l6-3.333v-6.47l-6-3.333l-6 3.333v6.47ZM12 2L3 7v10l9 5l9-5V7l-9-5Z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
		) : (
			<Badge
				className={`${badgeColors.get(intensity)} ${bgs.get(
					intensity,
				)} p-3 font-semibold`}
			>
				{intensity}
			</Badge>
		)}
	</>
);

export const WorkoutCard = ({
	title,
	description,
	intensity,
	id,
	userId,
	refetch,
	animationsReady,
}: Workout & { refetch: () => void; animationsReady?: boolean }) => {
	const [open, setOpen] = useState(false);
	const [openWorkout, setOpenWorkout] = useState(false);
	const [date, setDate] = useState<Date>(new Date());

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

	const removeWorkout = trpc.workout.removeWorkout.useMutation({
		onSuccess: () => {
			refetch();
		},
	});

	const handleRemove = () => {
		removeWorkout.mutate({
			id,
		});
	};

	const handleSubmit = () => {
		postWorkoutSession.mutate({
			workoutId: id,
			userId: userId,
			date: date,
			done: false,
		});
		setOpen(false);
		setOpenWorkout(false);
	};

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
				<AddSessionModalContent setDate={setDate} date={date} />
			</ReusableAlertDialog>
			<Modal open={openWorkout} onClose={() => setOpenWorkout(false)}>
				<WorkoutModalContent
					title={title}
					description={description}
					intensity={intensity}
				/>
			</Modal>
			<motion.div
				layout={animationsReady}
				initial={animationsReady ? { opacity: 0, y: -12, scale: 0.96 } : false}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{
					opacity: 0,
					x: -48,
					scale: 0.9,
					height: 0,
					paddingTop: 0,
					paddingBottom: 0,
				}}
				transition={{ duration: 0.25, ease: "easeOut" }}
				className="w-full overflow-hidden rounded-md "
			>
				<div className="py-1">
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-3">
							<IntesityBadge isSmall intensity={intensity} />
							<h2 className="text-sm font-medium text-white">
								{sliceLongText(title)}
							</h2>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button type="button" aria-label="Workout actions">
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
								<DropdownMenuItem onClick={() => setOpenWorkout(true)}>
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
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										setOpen(true);
										setOpenWorkout(false);
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
									>
										<path
											fill="currentColor"
											d="M12 4a1 1 0 0 0-1 1v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5a1 1 0 0 0-1-1Z"
										/>
									</svg>
									Create session
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										href={{
											pathname: "/create-workout/[slug]",
											query: { slug: id },
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												d="m14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
											/>
										</svg>
										Edit
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										href={{
											pathname: "/workout-notes/[slug]",
											query: { slug: id },
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												d="M4 14v-2h7v2zm0-4V8h11v2zm0-4V4h11v2zm9 14v-3.075l5.525-5.5q.225-.225.5-.325t.55-.1q.3 0 .575.113t.5.337l.925.925q.2.225.313.5t.112.55q0 .275-.1.563t-.325.512l-5.5 5.5zm7.5-6.575l-.925-.925zm-6 5.075h.95l3.025-3.05l-.45-.475l-.475-.45l-3.05 3.025zm3.525-3.525l-.475-.45l.925.925z"
											/>
										</svg>
										Notes
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									onSelect={(event) => {
										event.preventDefault();
										handleRemove();
									}}
								>
									{removeWorkout.isLoading ? (
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
					</div>
				</div>
			</motion.div>
		</>
	);
};
