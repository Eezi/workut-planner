"use client";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { PageHead } from "../components/Head";
import { PageTitle } from "../components/PageTitle";
import { WorkoutCard } from "../components/workoutCard";
import { trpc } from "../utils/trpc";

type PageProps = {};
const AllWorkouts: NextPage = (props: PageProps) => {
	const { status } = useSession();
	const {
		data: workouts,
		isLoading,
		refetch,
	} = trpc.workout.getAllWorkouts.useQuery(undefined, {
		enabled: status === "authenticated",
	});

	const router = useRouter();

	return (
		<>
			<PageHead title="All Workouts" />
			{isLoading ? (
				<div>Fetching workouts...</div>
			) : (
				<>
					<div className="flex items-center justify-between pb-6">
						<PageTitle title="All workouts" />
						<Button
							variant="outline"
							onClick={() => router.push("/create-workout/create")}
						>
							Create workout
						</Button>
					</div>
					{workouts && workouts.length === 0 ? (
						<div className="flex flex-col items-center justify-center pt-32 text-center">
							<p className="text-lg mb-2 font-semibold">No workouts yet</p>
							<p className="text-sm mb-4 text-muted-foreground">
								Create your first workout to get started
							</p>
							<Button onClick={() => router.push("/create-workout/create")}>
								Create workout
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-5 pb-8">
							{workouts?.map((workout) => (
								<WorkoutCard key={workout.id} {...workout} refetch={refetch} />
							))}
						</div>
					)}
				</>
			)}
		</>
	);
};

export default AllWorkouts;
