import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { WorkoutCard } from "../components/workoutCard";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PageHead } from '../components/Head';

const AllWorkouts: NextPage = () => {
  const { data: workouts, isLoading } = trpc.workout.getAllWorkouts.useQuery();
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionData) router.push("/");
  });

  return (
    <>
      <PageHead title="All Workouts" />
      <main className="flex min-h-screen flex-col items-center bg-main">
        {isLoading ? (
          <div>Fetching workouts...</div>
        ) : (
          <div className="container flex flex-col items-center gap-12 md:px-4 px-6 py-16 ">
            <h4 className="text-2xl font-extrabold tracking-tight text-white sm:text-[3rem]">
              All Workouts
            </h4>
            <div className="flex flex-wrap justify-center gap-5">
              {workouts?.map((workout) => {
                return <WorkoutCard key={workout.id} {...workout} />;
              })}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AllWorkouts;
