import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import { WorkoutCard } from "../components/workoutCard";
import { PageHead } from "../components/Head";
import { PageTitle } from "../components/PageTitle";

const AllWorkouts: NextPage = () => {
  const {
    data: workouts,
    isLoading,
    refetch,
  } = trpc.workout.getAllWorkouts.useQuery();

  return (
    <>
      <PageHead title="All Workouts" />
      {isLoading ? (
        <div>Fetching workouts...</div>
      ) : (
        <>
          <div className="flex items-center justify-between pb-6">
            <PageTitle title="All workouts" />
            <Link
              href={{
                pathname: "/create-workout/[slug]",
                query: { slug: "create" },
              }}
              className="btn-primary btn"
            >
              Create workout
            </Link>
          </div>
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
