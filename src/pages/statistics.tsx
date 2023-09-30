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
          <div className="stats stats-vertical shadow lg:stats-horizontal">
            {data?.map(({ id, title, session_count }) => (
              <div key={id} className="stat">
                <div className="stat-title">{title}</div>
                <div className="stat-value">{session_count}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Statistics;
