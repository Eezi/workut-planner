import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { WorkoutCard } from "../components/workoutCard";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PageHead } from "../components/Head";
import { PageTitle } from "../components/PageTitle";

const AllWorkouts: NextPage = () => {
  const {
    data: workouts,
    isLoading,
    refetch,
  } = trpc.workout.getAllWorkouts.useQuery();
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionData) router.push("/");
  });

  return (
    <>
      <PageHead title="All Workouts" />
      {isLoading ? (
        <div>Fetching workouts...</div>
      ) : (
        <>
          <PageTitle title="All workouts" />
          <div className="mb-20 flex flex-col gap-5">
            {workouts?.map((workout) => {
              return (
                <WorkoutCard key={workout.id} {...workout} refetch={refetch} />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default AllWorkouts;
