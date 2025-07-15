"use client";
import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { WorkoutCard } from "../components/workoutCard";
import { PageHead } from "../components/Head";
import { PageTitle } from "../components/PageTitle";
import PageTransition from "../components/PageTransition";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type PageProps = {};
const AllWorkouts: NextPage = (
  props: PageProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    data: workouts,
    isLoading,
    refetch,
  } = trpc.workout.getAllWorkouts.useQuery();

  const router = useRouter();

  return (
    <PageTransition ref={ref}>
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
          <div className="flex flex-col gap-5 pb-8">
            {workouts?.map((workout) => {
              return (
                <WorkoutCard key={workout.id} {...workout} refetch={refetch} />
              );
            })}
          </div>
        </>
      )}
    </PageTransition>
  );
};

export default AllWorkouts;
