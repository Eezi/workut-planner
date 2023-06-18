import { type NextPage } from "next";
import { PageHead } from "../components/Head";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { IntesityBadge } from "../components/workoutCard";
import dayjs from "dayjs";

const WorkoutSessions: NextPage = () => {
  const {
    data: sessions,
    isLoading,
    refetch,
  } = trpc.workoutSession.getAllWorkoutSessions.useQuery();
  const { data: sessionData } = useSession();
  const router = useRouter();
  const utils = trpc.useContext();

  useEffect(() => {
    if (!sessionData) router.push("/");
  });

  const markSessionDone = trpc.workoutSession.markSessionDone.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const removeSession = trpc.workoutSession.removeSession.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (!sessionData) router.push("/");
  });

  const handleMarkDone = (sessionId: string, checked: boolean) => {
    markSessionDone.mutate({
      id: sessionId,
      done: checked,
    });
  };

  const handleRemove = (sessionId: string) => {
    removeSession.mutate({
      id: sessionId,
    });
  };

  const allSessions = sessions?.sort((a, b) => {
    if (a.done === true) return 1;
    return Number(new Date(a.date)) - Number(new Date(b.date));
  });

  return (
    <div data-theme="forest">
      <PageHead title="Sessions" />
      <main className="flex min-h-screen flex-col items-center">
        {isLoading
          ? <div>Fetching sessions...</div>
          : (
            <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
              <h4 className="text-2xl font-extrabold tracking-tight text-white sm:text-[3rem]">
                All Workout Sessions
              </h4>
              <div className="grid grid-cols-1 gap-4 md:gap-8 w-full md:w-5/12">
                {allSessions?.map(({ date, workout, done, id }) => (
                  <div
                    key={id}
                    className="flex bg-grey min-w-full items-center gap-4 rounded-xl p-5"
                  >
                    <div>
                      <input
                        type="checkbox"
                        className="checkbox-secondary checkbox"
                        defaultChecked={done}
                        onChange={({ target }) =>
                          handleMarkDone(id, target.checked)}
                      />
                    </div>
                    <div className="ml-3 flex flex-col w-full">
                      <div className="flex justify-between">
                        <span className="label-text text-xl text-white">
                          {workout?.title}
                        </span>
                        <button
                          onClick={() => handleRemove(id)}
                          className="btn btn-square btn-outline btn-xs"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="my-1">
                        <IntesityBadge intensity={workout?.intensity} />
                      </div>
                      <span className="text-gray-400">
                        {dayjs(date).format("dddd")} -{" "}
                        {dayjs(date).format("DD.MM.YYYY")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </main>
    </div>
  );
};

export default WorkoutSessions;
