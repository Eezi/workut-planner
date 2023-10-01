import { trpc } from "../utils/trpc";
import { PageHead } from "../components/Head";

const Statistics = () => {
  const { data, isLoading, refetch } =
    trpc.workout.sessionCountsPerWorkout.useQuery();

  return (
    <div data-theme="nightforest">
      <PageHead title="Statistics" />
      <main className="flex min-h-screen flex-col items-center">
        {isLoading ? (
          <div>Fetching workouts...</div>
        ) : (
          <div className="mt-10 px-5">
            <h1 className="text-xl font-semibold md:text-3xl">
              Number of sessions per workout
            </h1>
            <div className="stats stats-vertical mt-3 shadow lg:stats-horizontal">
              {data?.map(({ id, title, count }) => (
                <div key={id} className="stat">
                  <div className="stat-title text-center">{title}</div>
                  <div className="stat-value text-center">{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Statistics;
